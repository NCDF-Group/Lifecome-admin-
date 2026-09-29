"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

/** Staff sign-in. Posts to `/api/auth/login`, which proxies to Lifecome-backend's
 * `POST /admin/auth/login` and stores the returned JWT in an httpOnly cookie. */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => undefined)) as { error?: string } | undefined;
        setError(body?.error ?? "Sign in failed.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-8 py-12 sm:px-16">
        <div className="mx-auto w-full max-w-sm">
          <h1 className="text-2xl font-bold text-ink">Sign in</h1>
          <p className="mt-1 text-sm text-ink-muted">
            LifeCome Live operations console - staff access only.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-ink">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@lifecomelive.com"
                className="rounded-control border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-blue/30"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-ink">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="rounded-control border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-blue/30"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm font-medium text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 rounded-control bg-accent px-4 py-2.5 text-sm font-semibold text-on-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-xs text-ink-muted">
            No account yet? The first platform administrator is created via{" "}
            <code className="rounded bg-surface px-1 py-0.5">npm run db:seed:staff</code> on the
            backend - see its README.
          </p>
        </div>
      </div>

      <div className="relative hidden lg:block">
        <Image src="/images/team-doctors.webp" alt="" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-strong/70 via-blue-strong/10 to-transparent" />
        <p className="absolute bottom-10 left-10 right-10 text-lg font-semibold text-white">
          Care that fits your life - the console behind it.
        </p>
      </div>
    </div>
  );
}
