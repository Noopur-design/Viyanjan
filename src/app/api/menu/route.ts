import { prisma } from "@/lib/prisma";
import { ok, created, handle } from "@/lib/api";
import { menuItemCreateSchema } from "@/lib/validators";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

// GET /api/menu?category=<slug>&featured=true
export function GET(req: Request) {
  return handle(async () => {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");
    const featured = searchParams.get("featured");

    const where: Prisma.MenuItemWhereInput = { isAvailable: true };
    if (categorySlug) where.category = { slug: categorySlug };
    if (featured === "true") where.isFeatured = true;

    const items = await prisma.menuItem.findMany({
      where,
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { createdAt: "asc" },
    });
    return ok(items);
  });
}

// POST /api/menu — create a menu item (admin)
export function POST(req: Request) {
  return handle(async () => {
    const body = await req.json();
    const input = menuItemCreateSchema.parse(body);
    const item = await prisma.menuItem.create({ data: input });
    return created(item);
  });
}
