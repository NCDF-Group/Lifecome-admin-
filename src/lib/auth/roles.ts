// Split from session.ts because session.ts imports "next/headers" (server-only) - this file has
// no such dependency, so client components (e.g. AppTopbar) can import it directly.
export type StaffRole =
  | "platform_administrator"
  | "clinical_administrator"
  | "hmo_operations"
  | "support_agent";

export const staffRoleLabel: Record<StaffRole, string> = {
  platform_administrator: "Platform administrator",
  clinical_administrator: "Clinical administrator",
  hmo_operations: "HMO operations",
  support_agent: "Support agent",
};
