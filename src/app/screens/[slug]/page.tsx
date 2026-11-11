import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Markup } from "@/components/markup";
import { getScreen, listScreens } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return listScreens().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const screen = getScreen((await params).slug);
  return { title: screen?.meta.title };
}

export default async function ScreenPage({ params }: { params: Promise<{ slug: string }> }) {
  const screen = getScreen((await params).slug);
  if (!screen) notFound();
  return <Markup html={screen.html} />;
}
