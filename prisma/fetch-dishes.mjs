// One-off: pull a spread of continental dishes from TheMealDB and write
// prisma/dishes.json. Images are downloaded separately (curl) into
// public/images/dishes/. Run: node prisma/fetch-dishes.mjs
import { writeFileSync } from "node:fs";

// cuisine -> how many dishes to take. TheMealDB "area" == cuisine.
const AREAS = {
  Italian: 3,
  French: 3,
  American: 3,
  British: 2,
  Mexican: 2,
  Japanese: 2,
  Chinese: 2,
  Indian: 2,
  Greek: 2,
  Spanish: 2,
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const out = [];
for (const [area, n] of Object.entries(AREAS)) {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
    );
    const json = await res.json();
    const meals = (json.meals ?? []).slice(0, n);
    for (const m of meals) {
      out.push({
        id: m.idMeal,
        name: m.strMeal,
        area,
        thumb: m.strMealThumb,
        image: `/images/dishes/${m.idMeal}.jpg`,
      });
    }
    console.log(`${area}: ${meals.length}`);
    await sleep(400); // be polite, avoid rate limit
  } catch (e) {
    console.log(`${area}: ERR ${e.message}`);
  }
}

writeFileSync(
  new URL("./dishes.json", import.meta.url),
  JSON.stringify(out, null, 2)
);
console.log(`\nWrote ${out.length} dishes to dishes.json`);
