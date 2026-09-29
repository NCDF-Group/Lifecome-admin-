import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { getMyProfile } from "@/features/profile/api";
import { staffAvatarUrl } from "@/features/staff/types";

export default async function ConsoleLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Fetched rather than read from the JWT so a name change shows up without signing in again.
  // adminFetch redirects to /login when there is no valid session.
  const profile = await getMyProfile();

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AppTopbar
            fullName={profile.fullName}
            email={profile.email}
            role={profile.role}
            avatarUrl={staffAvatarUrl(profile)}
          />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
