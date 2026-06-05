"use client";

import { useEffect, useRef, useState } from "react";
import CartToastArt from "./CartToastArt";

/**
 * Cart-page hero illustration: the animated couple-toasting SVG.
 * It is fetched and inlined into the DOM (rather than loaded via <img>/<object>)
 * so its background is fully transparent — the cart panel shows through — while
 * its built-in SMIL animations still play. Falls back to the SVG line-art.
 */
export default function CartHero() {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/images/cart-toast.svg?v=3")
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error("load failed"))))
      .then((txt) => {
        if (!cancelled && ref.current) ref.current.innerHTML = txt;
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) return <CartToastArt />;

  return (
    <div
      ref={ref}
      aria-label="A couple toasting wine over dinner"
      role="img"
      className="flex h-full w-full items-center justify-center [&>svg]:h-full [&>svg]:w-full"
    />
  );
}
