import { Check, ShieldEllipsis } from "lucide-react";
import { rolePermissions } from "@/features/staff/roles";
import { PageHeader } from "@/components/shared/page-header";

export default function StaffRolesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={ShieldEllipsis} title="Roles & permissions" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Object.entries(rolePermissions).map(([key, role]) => (
          <div
            key={key}
            className="flex flex-col gap-3 rounded-card border border-line bg-card p-5"
          >
            <div>
              <h2 className="text-sm font-bold text-ink">{role.label}</h2>
              <p className="text-xs text-ink-muted">{role.description}</p>
            </div>
            <ul className="flex flex-col gap-1.5">
              {role.permissions.map((permission) => (
                <li
                  key={permission}
                  className="flex items-start gap-2 text-xs text-ink"
                >
                  <Check className="mt-0.5 size-3.5 shrink-0 text-positive" />
                  {permission}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
