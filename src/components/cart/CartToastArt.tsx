/**
 * Cart-page hero: blueprint line-art of a couple clinking wine glasses.
 * Pure SVG, gold-on-dark. Figures are drawn with human proportions — leaning
 * in, elbows bent — and the raised arms animate so the glasses tap together
 * (twice) with a sparkle flash on each clink.
 */
export default function CartToastArt() {
  return (
    <svg
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
      role="img"
      aria-label="Line drawing of a couple clinking wine glasses in a toast"
    >
      <defs>
        <pattern
          id="vj-grid"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M40 0H0V40"
            fill="none"
            stroke="#c9a24b"
            strokeOpacity="0.07"
            strokeWidth="1"
          />
        </pattern>
        <linearGradient id="vj-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eccd80" />
          <stop offset="1" stopColor="#b6872f" />
        </linearGradient>
      </defs>

      <style>{`
        .vj-float { animation: vjFloat 7s ease-in-out infinite; }
        @keyframes vjFloat {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-5px); }
        }
        .vj-armL, .vj-armR, .vj-clink { transform-box: view-box; }
        .vj-armL { transform-origin: 290px 167px; animation: vjClinkL 2.6s ease-in-out infinite; }
        .vj-armR { transform-origin: 510px 167px; animation: vjClinkR 2.6s ease-in-out infinite; }
        @keyframes vjClinkL {
          0%,100% { transform: rotate(-2deg); }
          44%     { transform: rotate(0.5deg); }
          50%     { transform: rotate(1.7deg); }
          57%     { transform: rotate(-0.2deg); }
          64%     { transform: rotate(1.7deg); }
          72%     { transform: rotate(0.4deg); }
        }
        @keyframes vjClinkR {
          0%,100% { transform: rotate(2deg); }
          44%     { transform: rotate(-0.5deg); }
          50%     { transform: rotate(-1.7deg); }
          57%     { transform: rotate(0.2deg); }
          64%     { transform: rotate(-1.7deg); }
          72%     { transform: rotate(-0.4deg); }
        }
        .vj-clink { transform-origin: 400px 92px; animation: vjFlash 2.6s ease-in-out infinite; }
        @keyframes vjFlash {
          0%,40%,100% { opacity: 0; transform: scale(.5); }
          50%         { opacity: 1; transform: scale(1.15); }
          57%         { opacity: .15; transform: scale(.7); }
          64%         { opacity: 1; transform: scale(1); }
          80%         { opacity: 0; transform: scale(.6); }
        }
        @media (prefers-reduced-motion: reduce) {
          .vj-float, .vj-armL, .vj-armR { animation: none; }
          .vj-clink { animation: none; opacity: 1; }
        }
      `}</style>

      <rect width="800" height="500" fill="url(#vj-grid)" />

      <g
        className="vj-float"
        fill="none"
        stroke="url(#vj-gold)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* =================== WOMAN (left) =================== */}
        {/* hair */}
        <path d="M222 122 Q220 80 252 76 Q286 80 284 124" />
        <path d="M223 124 Q212 168 228 196" />
        <path d="M283 126 Q294 166 280 192" />
        {/* head */}
        <circle cx="253" cy="118" r="30" />
        {/* face (turned slightly toward partner) */}
        <g strokeWidth="1.5">
          <path d="M242 110 Q247 106 252 110" />
          <path d="M260 110 Q265 106 270 110" />
          <path d="M242 117 Q247 121 252 117" />
          <path d="M260 117 Q265 121 270 117" />
          <path d="M257 119 Q260 127 255 130" />
          <path d="M247 137 Q257 144 267 137" />
        </g>
        {/* neck */}
        <path d="M246 146 Q247 156 243 162" />
        <path d="M263 146 Q264 156 268 162" />
        {/* shoulders + dress (leaning right, inner shoulder raised) */}
        <path d="M214 178 Q253 150 290 167" />
        <path d="M243 160 L253 178 L264 158" />
        <path d="M214 178 Q202 238 222 300" />
        <path d="M290 167 Q302 232 286 300" />
        <path d="M224 256 Q254 264 284 254" />
        <path d="M253 178 Q255 238 253 298" />
        {/* outer (resting) arm */}
        <path d="M216 182 Q196 232 216 276" />

        {/* =================== MAN (right) =================== */}
        {/* hair */}
        <path d="M518 120 Q518 82 548 78 Q578 82 578 120" />
        <path d="M548 80 L562 102" />
        {/* head */}
        <circle cx="547" cy="118" r="30" />
        {/* face (turned slightly toward partner) */}
        <g strokeWidth="1.5">
          <path d="M530 110 Q535 106 540 110" />
          <path d="M548 110 Q553 106 558 110" />
          <path d="M530 117 Q535 121 540 117" />
          <path d="M548 117 Q553 121 558 117" />
          <path d="M543 119 Q540 127 545 130" />
          <path d="M533 137 Q543 144 553 137" />
        </g>
        {/* neck */}
        <path d="M537 146 Q536 156 532 162" />
        <path d="M554 146 Q557 156 557 162" />
        {/* shoulders + suit (leaning left, inner shoulder raised) */}
        <path d="M586 178 Q547 150 510 167" />
        <path d="M536 158 L547 180 L557 160" />
        <path d="M547 180 L530 214 M547 180 L564 214" />
        <path d="M586 178 Q598 238 578 300" />
        <path d="M510 167 Q498 232 514 300" />
        <path d="M547 180 Q547 240 547 298" />
        {/* outer (resting) arm */}
        <path d="M584 182 Q604 232 584 276" />

        {/* =================== TABLE =================== */}
        <ellipse cx="400" cy="312" rx="150" ry="30" />
        <path d="M392 338 L394 414 M408 338 L406 414" />
        <ellipse cx="400" cy="422" rx="44" ry="11" />
        <g stroke="#e8dcc0" strokeOpacity="0.7">
          <ellipse cx="346" cy="308" rx="22" ry="8" />
          <ellipse cx="346" cy="308" rx="12" ry="4" />
          <ellipse cx="454" cy="308" rx="22" ry="8" />
          <ellipse cx="454" cy="308" rx="12" ry="4" />
          <ellipse cx="400" cy="313" rx="28" ry="9" />
        </g>

        {/* =================== RAISED ARMS + GLASSES (animated) =================== */}
        {/* woman's arm: shoulder -> elbow -> forearm up to glass */}
        <g className="vj-armL">
          <path d="M290 167 Q318 184 332 198 Q360 152 388 120" />
          <path d="M388 120 Q394 114 399 117" />
          <path d="M373 96 L397 102 L391 122 L380 116 Z" />
          <path d="M378 106 L393 110" stroke="#eccd80" />
          <path d="M388 122 L387 140" />
          <path d="M379 141 L396 138" />
        </g>
        {/* man's arm */}
        <g className="vj-armR">
          <path d="M510 167 Q482 184 468 198 Q440 152 412 120" />
          <path d="M412 120 Q406 114 401 117" />
          <path d="M427 96 L403 102 L409 122 L420 116 Z" />
          <path d="M422 106 L407 110" stroke="#eccd80" />
          <path d="M412 122 L413 140" />
          <path d="M421 141 L404 138" />
        </g>

        {/* clink sparkle */}
        <g className="vj-clink" stroke="#f4dd9a" strokeWidth="2.4">
          <path d="M394 86 L390 74" />
          <path d="M400 84 L400 70" />
          <path d="M406 86 L410 74" />
          <path d="M385 96 L376 92" />
          <path d="M415 96 L424 92" />
        </g>
      </g>
    </svg>
  );
}
