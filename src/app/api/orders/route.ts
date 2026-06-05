import { prisma } from "@/lib/prisma";
import { ok, created, fail, handle } from "@/lib/api";
import { orderCreateSchema } from "@/lib/validators";
import { sendOrderConfirmation } from "@/lib/mail";

export const dynamic = "force-dynamic";

// GET /api/orders — list (admin/kitchen view)
export function GET() {
  return handle(async () => {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
    return ok(orders);
  });
}

// POST /api/orders — create an order. Totals are computed server-side
// from live DB prices so the client cannot tamper with amounts.
export function POST(req: Request) {
  return handle(async () => {
    const body = await req.json();
    const input = orderCreateSchema.parse(body);

    const ids = input.items.map((i) => i.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: ids }, isAvailable: true },
    });
    const byId = new Map(menuItems.map((m) => [m.id, m]));

    // reject if any requested item is missing/unavailable
    const missing = input.items.filter((i) => !byId.has(i.menuItemId));
    if (missing.length > 0) {
      return fail("Some items are unavailable", 409, {
        missing: missing.map((m) => m.menuItemId),
      });
    }

    const orderItems = input.items.map((i) => {
      const m = byId.get(i.menuItemId)!;
      return {
        menuItemId: m.id,
        quantity: i.quantity,
        unitPrice: m.price,
        nameSnapshot: m.name,
      };
    });
    const totalAmount = orderItems.reduce(
      (sum, i) => sum + i.unitPrice * i.quantity,
      0
    );

    // Payment. A real gateway (Stripe/Razorpay) would create + confirm a
    // PaymentIntent here using the server's secret key. Without keys we
    // simulate: CARD is treated as paid on success, COD stays unpaid until
    // collected at the table. The amount is always the server-computed total.
    const paymentMethod = input.paymentMethod ?? "COD";
    const paymentStatus = paymentMethod === "CARD" ? "PAID" : "UNPAID";
    const status = paymentMethod === "CARD" ? "CONFIRMED" : "PENDING";

    const order = await prisma.order.create({
      data: {
        customerName: input.customerName,
        phone: input.phone,
        email: input.email ?? "",
        reservationDate: input.reservationDate ? new Date(input.reservationDate) : null,
        tableNumber: input.tableNumber ?? "",
        guests: input.guests ?? 2,
        notes: input.notes ?? "",
        paymentMethod,
        paymentStatus,
        status,
        totalAmount,
        items: { create: orderItems },
      },
      include: { items: true },
    });

    // Fire the confirmation email. It never throws, so a mail problem
    // can't fail the order; we just don't block the response on it long.
    if (order.email) {
      await sendOrderConfirmation(order);
    }

    return created(order);
  });
}
