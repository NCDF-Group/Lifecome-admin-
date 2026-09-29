import { redirect } from "next/navigation";

/**
 * The bare domain root. `(console)/layout.tsx` itself checks the session and redirects an
 * unauthenticated visitor to `/login`, so this only needs to pick the default landing page.
 */
export default function RootPage() {
  redirect("/dashboard");
}
