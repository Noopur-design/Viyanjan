/**
 * Three warm trapezium light beams spilling from just below the nav — a flat,
 * bright top edge scattering wider and fading as it falls. Rendered as one
 * full-width SVG with the beams pinned to exact fractions of the width (1/6,
 * 1/2, 5/6) so they stay evenly aligned on any screen. Decorative only.
 */
export default function OverheadGlow() {
  const centers = [200, 600, 1000]; // sixths of the 1200-wide viewBox
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 400"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 top-[84px] z-[1] h-[35vh] w-full"
    >
      <defs>
        <linearGradient id="vj-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd27a" stopOpacity="0.6" />
          <stop offset="45%" stopColor="#ffce6e" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ffce6e" stopOpacity="0" />
        </linearGradient>
      </defs>
      <style>{`
        .vj-beam { animation: vjFlicker 5.5s ease-in-out infinite; }
        @keyframes vjFlicker {
          0%,100% { opacity: .9; }
          42%     { opacity: 1; }
          55%     { opacity: .84; }
          70%     { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) { .vj-beam { animation: none; } }
      `}</style>
      {/* mobile: a single beam scattering across the full width */}
      <path
        d="M556 0 L644 0 L1170 400 L30 400 Z"
        fill="url(#vj-beam)"
        className="vj-beam md:hidden"
      />
      {/* md+: three evenly-spaced beams */}
      {centers.map((cx, i) => (
        <path
          key={cx}
          d={`M${cx - 30} 0 L${cx + 30} 0 L${cx + 168} 400 L${cx - 168} 400 Z`}
          fill="url(#vj-beam)"
          className="vj-beam hidden md:block"
          style={{ animationDelay: `${i * 0.9}s` }}
        />
      ))}
    </svg>
  );
}
