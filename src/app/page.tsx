import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { getCurrentUser } from "@/lib/auth/session";
import { landingFor } from "@/lib/roles";

export const metadata: Metadata = { title: { absolute: "Sign in | LifeCome Health" } };
export const dynamic = "force-dynamic";

export default async function SignInPage() {
  const user = await getCurrentUser();
  if (user) redirect(landingFor(user));
  return (
    <AuthShell title="Welcome back" sub="Sign in to your LifeCome Health workspace.">
      <LoginForm />
    </AuthShell>
  );
}
