// Editorial "Journal" content — food stories. Static data; no DB needed.
// Each post body is an array of paragraphs (and optional subheadings).

export type PostBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "quote"; text: string };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string; // display string
  readMins: number;
  image: string; // /images/dishes/<id>.jpg
  body: PostBlock[];
};

export const POSTS: Post[] = [
  {
    slug: "why-the-table-turns",
    title: "Why the table turns",
    excerpt:
      "The rotating table isn't a gimmick — it's a philosophy about how we meet a dish, and how a dish meets us.",
    category: "Philosophy",
    author: "Chef Arav Mehta",
    date: "May 2026",
    readMins: 5,
    image: "/images/dishes/52796.jpg",
    body: [
      {
        type: "p",
        text: "When we first sketched Viyanjan, the table was a circle and nothing more. It turned because the world turns — because no single cuisine deserves to sit at the head.",
      },
      { type: "h", text: "Anticipation is an ingredient" },
      {
        type: "p",
        text: "There is a moment, just before a cloche lifts, when you don't yet know what waits beneath it. That half-second of not-knowing seasons everything that follows. We built the table to protect that moment.",
      },
      {
        type: "quote",
        text: "A dish you waited for tastes different from a dish that simply arrived.",
      },
      {
        type: "p",
        text: "So the table turns slowly, deliberately, bringing each plate forward in its own time. You don't browse a menu so much as you receive a procession.",
      },
    ],
  },
  {
    slug: "seven-kitchens-one-pantry",
    title: "Seven kitchens, one pantry",
    excerpt:
      "How we cook across continents without losing the soul of any single one of them.",
    category: "Craft",
    author: "Sous Chef Lena Park",
    date: "Apr 2026",
    readMins: 6,
    image: "/images/dishes/52773.jpg",
    body: [
      {
        type: "p",
        text: "Running seven cuisines from one kitchen sounds like chaos. In practice it's the opposite — it's discipline. The same knife that breaks down a salmon for teriyaki sears the steak for a Sichuan stir-fry an hour later.",
      },
      { type: "h", text: "Respect the origin" },
      {
        type: "p",
        text: "We don't fuse for the sake of novelty. A linguine is Italian to its core; a taco is unapologetically Mexican. Our job is to be faithful translators, not to rewrite the text.",
      },
      {
        type: "p",
        text: "What we share across all seven is the pantry: the same obsession with seasonality, the same olive oil pressed for us, the same salt. The throughline isn't a flavour — it's a standard.",
      },
    ],
  },
  {
    slug: "the-art-of-plating",
    title: "The art of plating",
    excerpt:
      "Negative space, height, and the single garnish that earns its place. A look at how a plate becomes a composition.",
    category: "Craft",
    author: "Chef Arav Mehta",
    date: "Apr 2026",
    readMins: 4,
    image: "/images/dishes/53366.jpg",
    body: [
      {
        type: "p",
        text: "A plate is a frame. What you leave empty matters as much as what you fill. We plate to a clock face — protein at six, structure rising toward twelve, sauce as the brushstroke that ties them.",
      },
      { type: "h", text: "One garnish, fully earned" },
      {
        type: "p",
        text: "Every element must do a job: contrast, acidity, crunch, colour. If a leaf is only decoration, it doesn't make it to the pass. Restraint is the most expensive ingredient we use.",
      },
    ],
  },
  {
    slug: "eating-with-the-seasons",
    title: "Eating with the seasons",
    excerpt:
      "Why our menu shifts with the markets, and what that means for the dish in front of you tonight.",
    category: "Sourcing",
    author: "Sous Chef Lena Park",
    date: "Mar 2026",
    readMins: 5,
    image: "/images/dishes/53011.jpg",
    body: [
      {
        type: "p",
        text: "Produce has a calendar, and we follow it rather than fight it. A tomato in August is a different creature than a tomato in February — so the dish changes too, and we let it.",
      },
      {
        type: "quote",
        text: "Cook what is ripe, and the recipe half-writes itself.",
      },
      {
        type: "p",
        text: "This is why you'll never find the exact same menu twice. The rotating table mirrors the rotating year.",
      },
    ],
  },
  {
    slug: "spice-without-fear",
    title: "Spice, without fear",
    excerpt:
      "Heat is a conversation, not a contest. How we build spice that warms rather than overwhelms.",
    category: "Flavour",
    author: "Chef Arav Mehta",
    date: "Mar 2026",
    readMins: 4,
    image: "/images/dishes/52819.jpg",
    body: [
      {
        type: "p",
        text: "Spice should reveal a dish, not bury it. We build heat in layers — bloomed in oil, balanced with acid and fat — so it arrives as warmth and lingers as memory.",
      },
      { type: "h", text: "Balance over bravado" },
      {
        type: "p",
        text: "A great chilli prawn linguine isn't about how much it burns; it's about how the sweetness of the prawn survives the fire. That survival is the whole point.",
      },
    ],
  },
  {
    slug: "a-night-at-viyanjan",
    title: "A night at Viyanjan",
    excerpt:
      "From the first turn of the table to the last spoon of dessert — what an evening with us actually feels like.",
    category: "Experience",
    author: "The Viyanjan Team",
    date: "Feb 2026",
    readMins: 6,
    image: "/images/dishes/52961.jpg",
    body: [
      {
        type: "p",
        text: "You arrive into low light and the smell of something searing. The table is already turning. You don't rush it; you let it bring the world to you, one cloche at a time.",
      },
      {
        type: "p",
        text: "By dessert, you've travelled through seven countries without leaving your chair. That's the night we set out to serve.",
      },
    ],
  },
];

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}
