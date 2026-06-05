import { Suspense } from "react";
import CartClient from "./CartClient";

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-cream/50">
          Loading…
        </div>
      }
    >
      <CartClient />
    </Suspense>
  );
}
