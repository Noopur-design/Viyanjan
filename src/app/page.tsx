import HomeExperienceClient from "@/components/home/HomeExperienceClient";
import StorySection from "@/components/home/StorySection";
import VideoSection from "@/components/home/VideoSection";
import Testimonials from "@/components/home/Testimonials";
import FaqSection from "@/components/home/FaqSection";
import ReserveCta from "@/components/home/ReserveCta";
import SiteFooter from "@/components/home/SiteFooter";
import OverheadGlow from "@/components/ui/OverheadGlow";
import { featuredDishes } from "@/lib/featuredDishes";

export default function HomePage() {
  // Featured dishes drive the plates on the rotating table.
  // Sourced from a static module so the home renders with no DB attached.
  return (
    <main className="relative">
      <OverheadGlow />
      <HomeExperienceClient items={featuredDishes} />
      <StorySection />
      <VideoSection />
      <Testimonials />
      <FaqSection />
      <ReserveCta />
      <SiteFooter />
    </main>
  );
}
