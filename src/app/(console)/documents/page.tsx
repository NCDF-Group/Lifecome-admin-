import { Folder } from "lucide-react";
import { PagePlaceholder } from "@/components/shared/page-placeholder";

export default function DocumentsPage() {
  return (
    <PagePlaceholder
      icon={Folder}
      title="Documents"
      description="Uploaded documents and scans, with review and moderation status."
    />
  );
}
