import { Settings } from "lucide-react";
import { PagePlaceholder } from "@/components/shared/page-placeholder";

export default function SettingsPage() {
  return (
    <PagePlaceholder
      icon={Settings}
      title="Settings"
      description="Console-wide settings: feature flags, integration keys and environment info."
    />
  );
}
