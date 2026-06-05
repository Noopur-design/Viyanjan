import { prisma } from "@/lib/prisma";
import { ok, fail, handle } from "@/lib/api";
import { menuItemUpdateSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/menu/[id]
export function GET(_req: Request, { params }: Ctx) {
  return handle(async () => {
    const { id } = await params;
    const item = await prisma.menuItem.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!item) return fail("Menu item not found", 404);
    return ok(item);
  });
}

// PATCH /api/menu/[id] — update (admin)
export function PATCH(req: Request, { params }: Ctx) {
  return handle(async () => {
    const { id } = await params;
    const body = await req.json();
    const input = menuItemUpdateSchema.parse(body);
    const item = await prisma.menuItem.update({ where: { id }, data: input });
    return ok(item);
  });
}

// DELETE /api/menu/[id] — remove (admin)
export function DELETE(_req: Request, { params }: Ctx) {
  return handle(async () => {
    const { id } = await params;
    await prisma.menuItem.delete({ where: { id } });
    return ok({ id });
  });
}
