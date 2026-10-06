import { UserCog, UserPlus } from "lucide-react";
import { listProviders } from "@/features/providers/api";
import { listStaff } from "@/features/staff/api";
import { InviteStaffDialog } from "@/features/staff/components/invite-staff-dialog";
import { StaffTable } from "@/features/staff/components/staff-table";
import { PageHeader } from "@/components/shared/page-header";
import { getSession } from "@/lib/auth/session";

export default async function StaffPage() {
  const [{ items: staff }, session] = await Promise.all([listStaff({ pageSize: 100 }), getSession()]);
  const canInvite = session?.claims.role === "platform_administrator";
  // Only needed to link a new clinician login to a provider profile.
  const providers = canInvite ? (await listProviders({ pageSize: 100 })).items : [];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={UserCog}
        title="Staff accounts"
        action={
          canInvite ? (
            <InviteStaffDialog providers={providers} />
          ) : (
            <button
              type="button"
              disabled
              title="Only platform administrators can invite staff"
              className="flex items-center gap-2 rounded-control bg-accent px-4 py-2 text-sm font-semibold text-on-accent opacity-60 disabled:cursor-not-allowed"
            >
              <UserPlus className="size-4" />
              Invite staff member
            </button>
          )
        }
      />
      <StaffTable staff={staff} />
    </div>
  );
}
