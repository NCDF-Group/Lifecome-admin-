import type { Metadata } from "next";
import { Sidebar } from "@/components/console/sidebar";
import { SignOutButton } from "@/components/console/sign-out-button";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin | LifeCome Health" } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser(["superadmin"]);
  return (
    <div className="c-shell">
      <Sidebar user={user} />
      <div className="c-main">
        <header className="c-top">
          <span className="c-top-title">Super administrator console</span>
          <div className="c-top-right">
            <span className="c-top-email">{user.email}</span>
            <SignOutButton />
          </div>
        </header>
        <div className="c-content">{children}</div>
      </div>
    </div>
  );
}
