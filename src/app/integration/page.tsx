import type { Metadata } from "next";
import { Markup } from "@/components/markup";
import { readFragment } from "@/lib/content";
import "@/styles/handover.css";

export const metadata: Metadata = { title: "Professional / Patient Integration" };

export default function IntegrationPage() {
  return <Markup className="handover" html={readFragment("integration.html")} />;
}
