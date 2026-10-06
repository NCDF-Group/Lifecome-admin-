import { redirect } from "next/navigation";
import { homeFor } from "@/config/navigation";
import { getSession } from "@/lib/auth/session";

/**
 * The bare domain root: signed-in staff go to their role's home (clinicians to their workspace,
 * everyone else to the dashboard); anyone else to the login page.
 */
export default async function RootPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  redirect(homeFor(session.claims.role));
}
