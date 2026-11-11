import { readFileSync } from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "src", "content");

export interface ScreenMeta {
  slug: string;
  title: string;
}

let index: ScreenMeta[] | undefined;

export function listScreens(): ScreenMeta[] {
  index ??= JSON.parse(readFileSync(path.join(root, "screens", "index.json"), "utf8")) as ScreenMeta[];
  return index;
}

export function getScreen(slug: string): { meta: ScreenMeta; html: string } | null {
  const meta = listScreens().find((s) => s.slug === slug);
  if (!meta) return null;
  return { meta, html: readFileSync(path.join(root, "screens", `${slug}.html`), "utf8") };
}

/** Trusted, repository-owned markup (never user input). */
export function readFragment(name: string): string {
  return readFileSync(path.join(root, name), "utf8");
}
