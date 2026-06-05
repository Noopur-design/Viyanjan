import { prisma } from "@/lib/prisma";
import { ok, fail, handle } from "@/lib/api";
import { orderStatusSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/orders/[id]
export function GET(_req: Request, { params }: Ctx) {
  return handle(async () => {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order) return fail("Order not found", 404);
    return ok(order);
  });
}

// PATCH /api/orders/[id] — advance status (kitchen/admin)
export function PATCH(req: Request, { params }: Ctx) {
  return handle(async () => {
    const { id } = await params;
    const body = await req.json();
    const { status } = orderStatusSchema.parse(body);
    const order = await prisma.order.update({ where: { id }, data: { status } });
    return ok(order);
  });
}
