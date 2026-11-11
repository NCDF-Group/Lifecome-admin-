import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PortalRuntime } from "@/components/portal-runtime";
import { requireUser } from "@/lib/auth/session";
import { isRole } from "@/lib/roles";

export const metadata: Metadata = { title: { absolute: "LifeCome Health | Professional Portal" } };
export const dynamic = "force-dynamic";

export default async function PortalPage({ searchParams }: { searchParams: Promise<{ as?: string }> }) {
  const user = await requireUser();
  let role = user.role;
  let preview = false;
  if (user.role === "superadmin") {
    const as = (await searchParams).as;
    if (!isRole(as) || as === "superadmin") redirect("/admin");
    role = as;
    preview = true;
  }
  const payload = JSON.stringify({ name: user.name, email: user.email, role, preview }).replace(/</g, "\\u003c");
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: `window.LIFECOME_USER=${payload};` }} />
      <PortalRuntime />
    </>
  );
}
