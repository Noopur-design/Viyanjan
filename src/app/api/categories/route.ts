import { prisma } from "@/lib/prisma";
import { ok, created, handle } from "@/lib/api";
import { categoryCreateSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

// GET /api/categories — list categories with their items
export function GET() {
  return handle(async () => {
    const categories = await prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        items: {
          where: { isAvailable: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });
    return ok(categories);
  });
}

// POST /api/categories — create a category (admin)
export function POST(req: Request) {
  return handle(async () => {
    const body = await req.json();
    const input = categoryCreateSchema.parse(body);
    const category = await prisma.category.create({ data: input });
    return created(category);
  });
}
