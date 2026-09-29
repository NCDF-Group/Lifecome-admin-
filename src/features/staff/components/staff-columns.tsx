import type { ColumnDef } from "@tanstack/react-table";
import { staffAvatarUrl, staffRoleLabel, type StaffMember } from "@/features/staff/types";
import { Avatar } from "@/components/shared/avatar";
import { StatusPill } from "@/components/shared/status-pill";

export const staffColumns: ColumnDef<StaffMember, unknown>[] = [
  {
    accessorKey: "fullName",
    header: "Name",
    cell: (info) => (
      <div className="flex items-center gap-2.5">
        <Avatar name={info.getValue() as string} src={staffAvatarUrl(info.row.original)} fallback="icon" size={30} />
        <span className="font-medium text-ink">{info.getValue() as string}</span>
      </div>
    ),
  },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "role",
    header: "Role",
    cell: (info) => staffRoleLabel[info.getValue() as StaffMember["role"]],
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => (
      <StatusPill
        tone={info.getValue() === "active" ? "success" : "neutral"}
        label={info.getValue() === "active" ? "Active" : "Suspended"}
      />
    ),
  },
];
