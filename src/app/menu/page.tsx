import { prisma } from "@/lib/prisma";
import MenuClient from "./MenuClient";
import SiteFooter from "@/components/home/SiteFooter";
import type { Category } from "@/types";

export const revalidate = 0;

export default async function MenuPage() {
  let categories: Category[] = [];
  try {
    const rows = await prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        items: {
          where: { isAvailable: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });
    categories = rows as unknown as Category[];
  } catch {
    categories = [];
  }

  return (
    <main>
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-28">
        <h1 className="font-display text-4xl text-gold">Our Menu</h1>
        <p className="mt-2 text-cream/60">
          Every dish, ready to add to your table.
        </p>
        <MenuClient categories={categories} />
      </div>
      <SiteFooter />
    </main>
  );
}
