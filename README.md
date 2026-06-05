# Viyanjan — A Feast in Motion 🍽️

An immersive restaurant website built with **Next.js 15 (App Router)**,
**PostgreSQL + Prisma**, and a **Three.js** (react-three-fiber) hero animation:
a round table that turns, carrying a plate of food for each featured dish.
Pick a dish and the table rotates that plate to the front while the food rises.

## Architecture

```
DATABASE   PostgreSQL + Prisma     Category → MenuItem → Order → OrderItem
BACKEND    Next.js Route Handlers  /api/categories, /api/menu, /api/orders
FRONTEND   React + Tailwind        Home (3D), Menu, Cart/Checkout, Admin
3D         @react-three/fiber      RotatingTable → Plate → Food (procedural)
```

### Folder map

```
prisma/
  schema.prisma            # DB models
  seed.ts                  # sample categories + dishes
src/
  lib/                     # prisma client, api envelope, validators, money
  app/api/                 # route handlers (the backend)
    categories/  menu/  menu/[id]/  orders/  orders/[id]/
  app/                     # pages: / (3D home), /menu, /cart, /admin
  components/
    scene/                 # RotatingTable, Plate, Food  ← the WebGL bits
    home/HomeExperience    # <Canvas> + overlay UI
  store/cart.ts            # zustand cart (persisted)
  types/index.ts           # shared types
```

## Setup

1. **Install**
   ```bash
   npm install
   ```

2. **Database** — defaults to **SQLite** (zero config, no server to install).
   The `.env` already contains `DATABASE_URL="file:./dev.db"`.

   To switch to **PostgreSQL** later: in `prisma/schema.prisma` set
   `provider = "postgresql"`, change `status String` on the `Order` model back
   to the `OrderStatus` enum, and point `DATABASE_URL` at your Postgres
   (local, or a hosted DB like Neon / Supabase).

3. **Create tables + seed sample dishes**
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Run**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 — the home page is the rotating table.

## Swapping in real 3D food models

The plates use procedural geometry so the scene runs with zero assets.
To use real models, set `modelUrl` on a `MenuItem` (e.g. `/models/butter-chicken.glb`,
place file in `public/models/`) and render it in `src/components/scene/Food.tsx`:

```tsx
import { Gltf } from "@react-three/drei";
// inside Food, when modelUrl is provided:
return <Gltf src={modelUrl} scale={0.5} />;
```

## API quick reference

| Method | Path                | Purpose                       |
| ------ | ------------------- | ----------------------------- |
| GET    | /api/categories     | categories + items            |
| POST   | /api/categories     | create category (admin)       |
| GET    | /api/menu           | items (`?category=`, `?featured=true`) |
| POST   | /api/menu           | create item (admin)           |
| GET/PATCH/DELETE | /api/menu/[id] | read / update / delete    |
| GET    | /api/orders         | list orders                   |
| POST   | /api/orders         | place order (totals server-side) |
| GET/PATCH | /api/orders/[id] | read / advance status        |

## Production notes

- The `/admin` console is **unauthenticated** for the demo. Add NextAuth or
  middleware-based auth before deploying.
- Prices are stored as integers (paise) to avoid float errors.
- Order totals are always recomputed server-side from live DB prices.
