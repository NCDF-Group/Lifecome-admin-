export type RoleKey = "superadmin" | "doctor" | "nurse" | "care" | "wellbeing" | "manager" | "admin";

export interface RoleInfo {
  key: RoleKey;
  label: string;
  description: string;
  /** Can this role be granted through an invite? */
  invitable: boolean;
  /** Chart / tag colour. */
  color: string;
}

export const ROLES: readonly RoleInfo[] = [
  { key: "superadmin", label: "Super administrator", description: "Full control of the platform, team, invites and analytics.", invitable: false, color: "#0b2540" },
  { key: "doctor", label: "Doctor / prescriber", description: "Consult, document, prescribe and refer.", invitable: true, color: "#0667b8" },
  { key: "nurse", label: "Nurse / clinician", description: "Assess, record observations and collect samples.", invitable: true, color: "#0e9bb3" },
  { key: "care", label: "Care professional", description: "Care plans, visit notes and escalations.", invitable: true, color: "#6d5bd0" },
  { key: "wellbeing", label: "Wellbeing practitioner", description: "Sessions, goals and progress notes.", invitable: true, color: "#45af03" },
  { key: "manager", label: "Clinical manager", description: "Oversight, allocation, incidents and audit.", invitable: true, color: "#b58a35" },
  { key: "admin", label: "Reception / operations", description: "Scheduling, demographics and payment status.", invitable: true, color: "#5b7083" },
];

export const ROLE_KEYS = ROLES.map((r) => r.key) as RoleKey[];
export const INVITABLE_ROLES = ROLES.filter((r) => r.invitable);

export function isRole(value: unknown): value is RoleKey {
  return typeof value === "string" && (ROLE_KEYS as string[]).includes(value);
}

export function roleInfo(key: string): RoleInfo {
  return ROLES.find((r) => r.key === key) ?? ROLES[ROLES.length - 1];
}

export function homeFor(role: RoleKey): string {
  return role === "superadmin" ? "/admin" : "/portal";
}
