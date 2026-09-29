import {
  Bell,
  Building2,
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
};

export const navigation: NavSection[] = [
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
