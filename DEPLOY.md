# Deploying Viyanjan

**Stack:** Next.js (SSR) on **Vercel** · **PostgreSQL on Google Cloud SQL**
(inside the Firebase project `viyanjan-63e54`).

There are 3 parts. **You do Part A & the login in Part C** (they need your Google
account + billing card). I (or you) can do everything else.

---

## Part A — Create the Cloud SQL Postgres database  *(you)*

> ⚠️ Do NOT use the Realtime Database you created — your app needs SQL.
> This creates a real Postgres instance in the same Firebase/GCP project.

1. Go to **https://console.cloud.google.com/sql** and select project
   **viyanjan-63e54** (top bar).
2. If prompted, **enable billing (Blaze)** — Cloud SQL requires it. Add a card.
3. Click **Create instance → PostgreSQL**.
4. Settings:
   - **Instance ID:** `viyanjan-db`
   - **Password:** set a strong one for the `postgres` user — **save it**.
   - **Database version:** PostgreSQL 16
   - **Edition / size:** *Enterprise → Sandbox / smallest shared-core* (cheapest)
   - **Region:** pick the one closest to you (remember it)
5. Create it (takes ~5–10 min).
6. Once ready, open the instance → **Databases → Create database** → name it
   `viyanjan`.
7. Open **Connections → Networking → Public IP** → **Add network** →
   temporarily allow `0.0.0.0/0` (so Vercel + your machine can connect).
   *(Tighten later, or use the Cloud SQL connector.)*
8. Note the instance's **Public IP address**.

You now have everything for the connection string:
```
postgresql://postgres:YOUR_PASSWORD@PUBLIC_IP:5432/viyanjan?sslmode=require
```

---

## Part B — Point the app at the new database & migrate  *(me/you)*

1. Put the connection string in **`.env`** (local):
   ```
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@PUBLIC_IP:5432/viyanjan?sslmode=require"
   ```
2. Create the tables (first real migration) and seed the dishes:
   ```powershell
   cd C:\dev\Viyanjan
   npx prisma migrate dev --name init
   npm run db:seed
   ```
3. Verify locally:
   ```powershell
   npm run dev        # http://localhost:3000 should load from Cloud SQL
   ```

---

## Part C — Deploy to Vercel  *(login = you, rest = me/you)*

1. Install + log in (browser opens — your account):
   ```powershell
   npm i -g vercel
   vercel login
   ```
2. From the project folder, link & deploy:
   ```powershell
   cd C:\dev\Viyanjan
   vercel            # answer prompts: link to a new project "viyanjan"
   ```
3. Add the database env var to Vercel (Production + Preview + Development):
   ```powershell
   vercel env add DATABASE_URL
   # paste the same postgresql://...sslmode=require string
   ```
4. Ship production:
   ```powershell
   vercel --prod
   ```
   The `build` script runs `prisma migrate deploy` automatically, so the
   production DB gets the schema. Seed once against the prod DB if needed:
   ```powershell
   npm run db:seed        # with DATABASE_URL pointing at Cloud SQL
   ```

Your live URL will be printed, e.g. `https://viyanjan.vercel.app`.

---

## Notes
- **Cost:** Cloud SQL bills hourly even when idle (~$8–9/mo for the smallest
  instance). Vercel hosting is free for this. To go fully free, swap Cloud SQL
  for a free **Neon** Postgres — only `DATABASE_URL` changes, nothing else.
- **Security TODO before real launch:** the `/admin` page is unauthenticated.
  Gate it (NextAuth / middleware) before going public.
- **Card payments** are simulated. Wire Razorpay/Stripe for real charges.
