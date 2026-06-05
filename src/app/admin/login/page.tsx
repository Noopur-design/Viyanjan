"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setAttemptsLeft(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, remember }),
      });
      const json = await res.json();
      if (res.ok) {
        router.replace("/admin");
        router.refresh();
      } else {
        setError(json.error ?? "Incorrect password");
        if (json.attemptsLeft !== undefined) setAttemptsLeft(json.attemptsLeft);
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-cream/10 bg-[#1a0f0a] p-8"
      >
        <div className="eyebrow text-[10px] text-gold/70">Viyanjan</div>
        <h1 className="mt-2 font-display text-3xl font-light text-gold">
          Admin access
        </h1>
        <p className="mt-2 text-sm text-cream/50">
          Enter the admin password to continue.
        </p>

        <input
          type="password"
          autoFocus
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-6 w-full rounded-xl border border-cream/20 bg-black/40 px-3 py-3 text-cream placeholder:text-cream/35 focus:border-gold focus:outline-none"
        />

        {/* remember me */}
        <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-cream/55 select-none">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 accent-gold rounded"
          />
          Stay signed in for 30 days
        </label>

        {error && (
          <div className="mt-4 rounded-lg border border-ember/30 bg-ember/10 px-4 py-3">
            <p className="text-sm text-ember">{error}</p>
            {attemptsLeft !== null && attemptsLeft > 0 && (
              <p className="mt-1 text-xs text-cream/45">
                {attemptsLeft} attempt{attemptsLeft !== 1 ? "s" : ""} remaining before lockout.
              </p>
            )}
            {attemptsLeft === 0 && (
              <p className="mt-1 text-xs text-cream/45">
                Account locked. Try again in 15 minutes.
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={busy || !password}
          className="mt-5 w-full rounded-full border border-gold bg-gold py-3 text-[11px] uppercase tracking-[0.2em] text-char transition hover:bg-transparent hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? "Checking…" : "Sign in"}
        </button>

        <p className="mt-4 text-center text-[10px] text-cream/25">
          Session secured with HttpOnly cookie · SameSite strict
        </p>
      </form>
    </main>
  );
}
