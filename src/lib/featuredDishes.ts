// Static featured-dish data for the rotating table on the home page.
// Lives in code (not the DB) so the home always renders — no DATABASE_URL,
// no Prisma call, no seed step required to deploy.
// Shape matches what prisma.menuItem.findMany would have returned.

import type { MenuItem } from "@/types";
import raw from "../../prisma/dishes.json";

type RawDish = {
  id: string;
  name: string;
  area: string;
  image: string;
};

const cuisineColor: Record<string, string> = {
  Italian: "#c0492b",
  French: "#d8a657",
  American: "#b5651d",
  British: "#9c6b3f",
  Mexican: "#cf5b2a",
  Japanese: "#c44e54",
  Chinese: "#a8341f",
  Indian: "#d98324",
  Greek: "#4f7fae",
  Spanish: "#d4762f",
};

const basePrice: Record<string, number> = {
  Italian: 34900,
  French: 42900,
  American: 31900,
  British: 33900,
  Mexican: 28900,
  Japanese: 44900,
  Chinese: 29900,
  Indian: 30900,
  Greek: 32900,
  Spanish: 35900,
};

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const perAreaIndex = new Map<string, number>();

export const featuredDishes: MenuItem[] = (raw as RawDish[]).map((d) => {
  const i = perAreaIndex.get(d.area) ?? 0;
  perAreaIndex.set(d.area, i + 1);
  const spicy = ["Indian", "Mexican", "Chinese"].includes(d.area)
    ? 2
    : ["Japanese", "Spanish"].includes(d.area)
      ? 1
      : 0;
  return {
    id: d.id,
    name: d.name.trim(),
    description: `A ${d.area} classic — ${d.name.trim()}, prepared in-house and plated to order.`,
    price: (basePrice[d.area] ?? 30000) + (i % 3) * 2000,
    imageUrl: d.image,
    modelUrl: "",
    foodColor: cuisineColor[d.area] ?? "#caa15a",
    isFeatured: true,
    isAvailable: true,
    spiceLevel: spicy,
    categoryId: slug(d.area),
    category: { name: d.area, slug: slug(d.area) },
  };
});
