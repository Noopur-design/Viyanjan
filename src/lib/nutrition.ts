// Nutrition isn't stored in the DB, so we derive a *stable* estimate per dish
// from its id + name. Values are deterministic (same dish → same numbers) and
// internally consistent (calories ≈ 4·protein + 4·carbs + 9·fat).

export type Nutrition = {
  calories: number;
  macros: { protein: number; carbs: number; fat: number }; // grams
  micros: {
    fiber: number; // g
    sugar: number; // g
    sodium: number; // mg
    iron: number; // % DV
    calcium: number; // % DV
    vitaminC: number; // % DV
  };
  servingG: number;
};

function seeded(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// rough macro profile by dish archetype (per serving, grams)
function profile(name: string) {
  const n = name.toLowerCase();
  if (/salad|quinoa|blanco|soup/.test(n))
    return { p: [8, 18], c: [18, 32], f: [10, 22], fib: [4, 8] };
  if (/pasta|linguine|alfredo|noodle|primavera/.test(n))
    return { p: [16, 26], c: [55, 80], f: [18, 32], fib: [3, 6] };
  if (/salmon|fish|prawn|shrimp|steak|beef|chicken|karaage|teriyaki|saganaki/.test(n))
    return { p: [28, 46], c: [6, 20], f: [16, 30], fib: [1, 4] };
  if (/taco|roll|bravas|potato|fries/.test(n))
    return { p: [10, 20], c: [35, 55], f: [16, 28], fib: [3, 7] };
  if (/crumble|budino|ricotta|cake|pudding|dessert|jamun|tart/.test(n))
    return { p: [5, 10], c: [45, 70], f: [14, 26], fib: [1, 3] };
  return { p: [14, 26], c: [30, 50], f: [14, 26], fib: [2, 5] };
}

export function getNutrition(seed: string, name: string): Nutrition {
  const rnd = seeded(seed + name);
  const pr = profile(name);
  const pick = ([lo, hi]: number[]) => Math.round(lo + rnd() * (hi - lo));

  const protein = pick(pr.p);
  const carbs = pick(pr.c);
  const fat = pick(pr.f);
  const fiber = pick(pr.fib);
  const calories = protein * 4 + carbs * 4 + fat * 9;

  return {
    calories,
    macros: { protein, carbs, fat },
    micros: {
      fiber,
      sugar: Math.round(carbs * (0.15 + rnd() * 0.3)),
      sodium: 250 + Math.round(rnd() * 750),
      iron: 6 + Math.round(rnd() * 24),
      calcium: 4 + Math.round(rnd() * 22),
      vitaminC: 2 + Math.round(rnd() * 40),
    },
    servingG: 280 + Math.round(rnd() * 180),
  };
}
