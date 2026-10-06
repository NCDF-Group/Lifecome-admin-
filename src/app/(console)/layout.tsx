import { RoleRouteGuard } from "@/components/auth/role-route-guard";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { NavTour } from "@/components/tour/nav-tour";
import { TourProvider } from "@/components/tour/tour-context";
import { getMyProfile } from "@/features/profile/api";
import { staffAvatarUrl } from "@/features/staff/types";

export default async function ConsoleLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Fetched rather than read from the JWT so a name change shows up without signing in again.
  // adminFetch redirects to /login when there is no valid session.
  const profile = await getMyProfile();

  return (
    <SidebarProvider>
      <TourProvider>
        <div className="flex h-screen bg-background">
          <AppSidebar role={profile.role} />
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
        <RoleRouteGuard role={profile.role} />
        <NavTour />
      </TourProvider>
    </SidebarProvider>
  );
}
