import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { SetPasswordForm } from "@/components/auth/set-password-form";
import { getCurrentUser } from "@/lib/auth/session";
import { homeFor } from "@/lib/roles";

export const metadata: Metadata = { title: "Set a new password" };
export const dynamic = "force-dynamic";

export default async function SetPasswordPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  if (!user.mustChangePassword) redirect(homeFor(user.role));
  return (
    <AuthShell title="Set a new password" sub={`Welcome, ${user.name}. You signed in with a default password — choose your own to continue.`}>
      <SetPasswordForm email={user.email} />
    </AuthShell>
  );
}
