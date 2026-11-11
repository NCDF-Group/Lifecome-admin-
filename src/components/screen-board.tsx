"use client";

import { useId, useMemo, useState } from "react";

export interface BoardTile {
  group: string;
  search: string;
  small: string;
  title: string;
  /** Trusted, repository-owned markup for the miniature preview. */
  mini: string;
  links: { href: string; text: string }[];
}

export function ScreenBoard({ tiles }: { tiles: BoardTile[] }) {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("");

  const groups = useMemo(() => [...new Set(tiles.map((t) => t.group))], [tiles]);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tiles.filter((t) => t.search.includes(q) && (!group || t.group === group));
  }, [tiles, query, group]);

  return (
    <>
      <div className="tools">
        <input
          id={searchId}
          className="search"
          placeholder="Search screens"
          aria-label="Search screens"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select aria-label="Filter workflow" value={group} onChange={(e) => setGroup(e.target.value)}>
          <option value="">All workflows</option>
          {groups.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
        <span className="tag" role="status">
          {visible.length} screens
        </span>
      </div>
      <main className="board">
        {visible.map((tile) => (
          <article className="tile" key={tile.title}>
            <header>
              <small>{tile.small}</small>
              <h2>{tile.title}</h2>
            </header>
            <div className="viewport">
              <div className="mini" dangerouslySetInnerHTML={{ __html: tile.mini }} />
            </div>
            {tile.links.map((link) => (
              // Plain anchors on purpose: "/" boots the portal engine on a fresh document.
              <a key={link.href} href={link.href}>
                {link.text} →
              </a>
            ))}
          </article>
        ))}
      </main>
    </>
  );
}
