/** Renders trusted, repository-owned HTML fragments (never user input). */
export function Markup({ html, as: Tag = "div", className }: { html: string; as?: "div" | "section"; className?: string }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
