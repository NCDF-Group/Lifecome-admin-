import { redirect } from "next/navigation";
import { getSession, type StaffSession } from "./session";

/** Server-component guard: redirects to `/login` if there's no valid staff session. */
export async function requireStaffSession(): Promise<StaffSession> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}
