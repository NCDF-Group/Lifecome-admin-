import type { Metadata } from "next";
import Link from "next/link";
import { ScreenBoard, type BoardTile } from "@/components/screen-board";
import tiles from "@/content/screen-board.json";
import "@/styles/board.css";

export const metadata: Metadata = { title: "Professional Screen Board" };

export default function ScreenBoardPage() {
  return (
    <>
      <header className="boardhead">
        <p className="eyebrow" style={{ color: "#8bc9ba" }}>
          LIFECOME HEALTH · PROFESSIONAL PORTAL
        </p>
        <h1>Live screens. Connected workflows.</h1>
        <p>
          56 professional portal screens across clinical records, prescribing, laboratory workflows, care, wellbeing,
          operations and patient-app integration. Every layout has a working interactive route.
        </p>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a className="btn" href="/">
          Open professional portal
        </a>{" "}
        <Link className="btn secondary" href="/integration">
          Integration specification
        </Link>
      </header>
      <ScreenBoard tiles={tiles as BoardTile[]} />
    </>
  );
}
