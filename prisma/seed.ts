import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const prisma = new PrismaClient();

type Dish = {
  id: string;
  name: string;
  area: string; // cuisine
  image: string; // /images/dishes/<id>.jpg
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const dishes: Dish[] = JSON.parse(
  readFileSync(join(__dirname, "dishes.json"), "utf-8")
).map((d: Dish) => ({ ...d, name: d.name.trim() }));

// A warm plate-tint per cuisine (fallback / 3D accent under the photo).
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

const blurb = (name: string, area: string) =>
  `A ${area} classic — ${name}, prepared in-house and plated to order.`;

const priceFor = (area: string, i: number) => {
  const base: Record<string, number> = {
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
  return (base[area] ?? 30000) + (i % 3) * 2000;
};

async function main() {
  console.log("Seeding from dishes.json…");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();

  const byArea = new Map<string, Dish[]>();
  for (const d of dishes) {
    if (!byArea.has(d.area)) byArea.set(d.area, []);
    byArea.get(d.area)!.push(d);
  }

  let order = 0;
  let total = 0;
  for (const [area, list] of byArea) {
    order += 1;
    const category = await prisma.category.create({
      data: {
        name: area,
        slug: area.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        order,
      },
    });

    for (let i = 0; i < list.length; i++) {
      const d = list[i];
      await prisma.menuItem.create({
        data: {
          name: d.name,
          description: blurb(d.name, area),
          price: priceFor(area, i),
          imageUrl: d.image,
          foodColor: cuisineColor[area] ?? "#caa15a",
          spiceLevel: ["Indian", "Mexican", "Chinese"].includes(area)
            ? 2
            : ["Japanese", "Spanish"].includes(area)
              ? 1
              : 0,
          // feature EVERY dish so the table is filled with varied cuisines
          isFeatured: true,
          categoryId: category.id,
        },
      });
      total += 1;
    }
    console.log(`  ${area}: ${list.length}`);
  }
  console.log(`Done. ${total} dishes across ${byArea.size} cuisines.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
