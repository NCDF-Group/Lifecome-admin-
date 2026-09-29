import { UserPen } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { getMyProfile } from "@/features/profile/api";
import { ChangePasswordForm } from "@/features/profile/components/change-password-form";
import { ProfileForm } from "@/features/profile/components/profile-form";
import { ProfilePhoto } from "@/features/profile/components/profile-photo";
import { staffAvatarUrl } from "@/features/staff/types";
import { formatRelativeTime } from "@/lib/format";
import { staffRoleLabel } from "@/lib/auth/roles";

export default async function ProfilePage() {
  const profile = await getMyProfile();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <PageHeader icon={UserPen} title="Edit profile" />

      <section className="flex flex-col items-center gap-4 rounded-card border border-line bg-card p-6">
        <ProfilePhoto fullName={profile.fullName} avatarUrl={staffAvatarUrl(profile)} />
        <div className="flex min-w-0 flex-col items-center gap-0.5 text-center">
          <span className="text-base font-semibold text-ink">{profile.fullName}</span>
          <span className="text-sm text-ink-muted">{profile.email}</span>
          <span className="text-xs text-ink-muted">
            {staffRoleLabel[profile.role]}
            {profile.lastLoginAt && ` · Last signed in ${formatRelativeTime(profile.lastLoginAt)}`}
          </span>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-card border border-line bg-card p-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold text-ink">Profile details</h2>
          <p className="text-xs text-ink-muted">
            Your email and role can only be changed by a platform administrator.
          </p>
        </div>
        <ProfileForm fullName={profile.fullName} email={profile.email} role={staffRoleLabel[profile.role]} />
      </section>

      <section className="flex flex-col gap-4 rounded-card border border-line bg-card p-5">
        <h2 className="text-sm font-semibold text-ink">Change password</h2>
        <ChangePasswordForm />
      </section>
    </div>
  );
}
