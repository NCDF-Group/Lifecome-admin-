import type { Metadata } from "next";
import { PortalRuntime } from "@/components/portal-runtime";

export const metadata: Metadata = { title: { absolute: "LifeCome Health | Professional Portal" } };

export default function Home() {
  return <PortalRuntime />;
}
