"use client";

import dynamic from "next/dynamic";
import type { MenuItem } from "@/types";

// Three.js touches WebGL/window, so the whole experience must be client-only.
// A client component is allowed to use `ssr: false`; a server component is not —
// hence this thin wrapper between page.tsx (server) and HomeExperience (3D).
const HomeExperience = dynamic(() => import("./HomeExperience"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center">
      <span className="animate-pulse font-display text-2xl text-gold">
        Setting the table…
      </span>
    </div>
  ),
});

export default function HomeExperienceClient({
  items,
}: {
  items: MenuItem[];
}) {
  return <HomeExperience items={items} />;
}
