import {
  Bell,
  Building2,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  FileText,
  Folder,
  HeartPulse,
  LayoutDashboard,
  MapPin,
  MessagesSquare,
  Package,
  Settings,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  Stethoscope,
  UserCog,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";
import type { StaffRole } from "@/lib/auth/roles";

/**
 * The console's sidebar, one entry per section. `href` matches the route
 * under `src/app/(console)/`, and `backendModule` names the
 * `Lifecome-backend/src/modules/<name>` folder that section reads from -
 * keeping the two in lockstep is the point of listing it here rather than
 * letting each page hardcode its own module name.
 */
export type NavItem = {
  label: string;
  href: string;
  backendModule: string;
  icon: LucideIcon;
};

export type NavSection = {
  title: string;
  items: NavItem[];
  /** Shown only to these roles. Omit for "every role except clinicians". */
  roles?: StaffRole[];
};

export const navigation: NavSection[] = [
  {
    title: "My workspace",
    roles: ["clinician"],
    items: [
      { label: "Agenda", href: "/workspace", backendModule: "clinician", icon: CalendarCheck },
      {
        label: "Availability",
        href: "/workspace/availability",
        backendModule: "clinician",
        icon: CalendarClock,
      },
    ],
  },
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        backendModule: "-",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Care",
    items: [
      {
        label: "Patients",
        href: "/patients",
        backendModule: "patient",
        icon: Users,
      },
      {
        label: "Providers",
        href: "/providers",
        backendModule: "provider-directory",
        icon: Stethoscope,
      },
      {
        label: "Bookings",
        href: "/bookings",
        backendModule: "booking",
        icon: CalendarDays,
      },
      {
        label: "Scheduling",
        href: "/scheduling",
        backendModule: "scheduling",
        icon: CalendarClock,
      },
      {
        label: "Consultations",
        href: "/consultations",
        backendModule: "consultation",
        icon: Video,
      },
      {
        label: "Care coordination",
        href: "/care-coordination",
        backendModule: "care-coordination",
        icon: HeartPulse,
      },
      {
        label: "Locations",
        href: "/locations",
        backendModule: "-",
        icon: MapPin,
      },
    ],
  },
  {
    title: "Records",
    items: [
      {
        label: "Clinical records",
        href: "/clinical-records",
        backendModule: "clinical-records",
        icon: FileText,
      },
      {
        label: "Documents",
        href: "/documents",
        backendModule: "documents",
        icon: Folder,
      },
      {
        label: "Consent",
        href: "/consent",
        backendModule: "consent",
        icon: ShieldCheck,
      },
    ],
  },
  {
    title: "Payer & payments",
    items: [
      {
        label: "Payers",
        href: "/payers",
        backendModule: "payer",
        icon: Building2,
      },
      {
        label: "Eligibility",
        href: "/eligibility",
        backendModule: "eligibility",
        icon: ShieldQuestion,
      },
      {
        label: "Authorisations",
        href: "/authorisations",
        backendModule: "authorisation",
        icon: ClipboardCheck,
      },
      {
        label: "Payments",
        href: "/payments",
        backendModule: "payment",
        icon: CreditCard,
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        label: "Messaging",
        href: "/messaging",
        backendModule: "messaging",
        icon: MessagesSquare,
      },
      {
        label: "Notifications",
        href: "/notifications",
        backendModule: "notifications",
        icon: Bell,
      },
    ],
  },
  {
    title: "Platform",
    items: [
      {
        label: "Audit log",
        href: "/audit",
        backendModule: "audit",
        icon: ShieldAlert,
      },
      {
        label: "Service catalogue",
        href: "/service-catalogue",
        backendModule: "service-catalogue",
        icon: Package,
      },
      {
        label: "Staff & roles",
        href: "/staff",
        backendModule: "identity",
        icon: UserCog,
      },
      {
        label: "Settings",
        href: "/settings",
        backendModule: "-",
        icon: Settings,
      },
    ],
  },
];

/** The sections a signed-in staff member should see. Clinicians get only their own workspace;
 * everyone else gets the admin console (the backend enforces the same split - see RolesGuard). */
export function navigationFor(role: StaffRole): NavSection[] {
  return navigation.filter((section) =>
    section.roles ? section.roles.includes(role) : role !== "clinician",
  );
}

/** Where a role lands after signing in. */
export function homeFor(role: StaffRole): string {
  return role === "clinician" ? "/workspace" : "/dashboard";
}
