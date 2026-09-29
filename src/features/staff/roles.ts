import type { StaffRole } from "@/lib/auth/roles";

/** What each staff role can see/do - copied from the blueprint's persona
 * table (§2.3). Static content, not fetched from anywhere: it documents
 * an intended permission model the backend doesn't enforce yet. */
export const rolePermissions: Record<
  StaffRole,
  { label: string; description: string; permissions: string[] }
> = {
  platform_administrator: {
    label: "Platform administrator",
    description: "Configuration, content, roles, integrations, monitoring.",
    permissions: [
      "Manage staff accounts and roles",
      "Manage service catalogue and pricing",
      "Configure payer and messaging/notification integrations",
      "View system-wide audit log",
    ],
  },
  clinical_administrator: {
    label: "Clinical administrator",
    description: "Governance, clinician management, audit, escalation.",
    permissions: [
      "Approve and suspend provider network accounts",
      "Review clinical record access and escalations",
      "View clinical and record-access audit events",
    ],
  },
  hmo_operations: {
    label: "HMO operations",
    description:
      "Eligibility/authorisation interface, reconciliation, limited payer data.",
    permissions: [
      "View and manage payer integrations",
      "Review eligibility checks and authorisations",
      "Reconcile payer-settled transactions",
    ],
  },
  support_agent: {
    label: "Support agent",
    description:
      "Account/booking support with restricted clinical-data access.",
    permissions: [
      "View patient account and booking details",
      "Reschedule or cancel a booking on a patient's behalf",
      "No access to clinical records or payer eligibility data",
    ],
  },
};
