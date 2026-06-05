import { prisma } from "@/lib/prisma";
import HomeExperienceClient from "@/components/home/HomeExperienceClient";
import StorySection from "@/components/home/StorySection";
import VideoSection from "@/components/home/VideoSection";
import Testimonials from "@/components/home/Testimonials";
import FaqSection from "@/components/home/FaqSection";
import ReserveCta from "@/components/home/ReserveCta";
import SiteFooter from "@/components/home/SiteFooter";
import OverheadGlow from "@/components/ui/OverheadGlow";
import type { MenuItem } from "@/types";

export const revalidate = 0;

export default async function HomePage() {
  // Featured dishes drive the plates on the rotating table.
  let items: MenuItem[] = [];
  try {
    const rows = await prisma.menuItem.findMany({
      where: { isFeatured: true, isAvailable: true },
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { createdAt: "asc" },
    });
    items = rows as unknown as MenuItem[];
  } catch {
    items = [];
  }

  if (items.length === 0) {
    return (
      <main className="flex h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-display text-4xl text-gold">Viyanjan</h1>
        <p className="max-w-md text-cream/70">
          No featured dishes yet. Set up the database and seed it:
        </p>
        <pre className="rounded-lg bg-black/50 p-4 text-left text-sm text-cream/80">
{`npm install
cp .env.example .env   # set DATABASE_URL
npm run db:push
npm run db:seed
npm run dev`}
        </pre>
      </main>
    );
  }

  return (
    <main className="relative">
      {/* overhead light, just below the nav */}
      <OverheadGlow />

      {/* 3D hero */}
      <HomeExperienceClient items={items} />

      {/* scrolling content */}
      <StorySection />
      <VideoSection />
      <Testimonials />
      <FaqSection />
      <ReserveCta />
      <SiteFooter />
    </main>
  );
}
