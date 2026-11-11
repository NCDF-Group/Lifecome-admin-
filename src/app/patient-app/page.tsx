import type { Metadata } from "next";
import { PatientRecordView } from "@/components/patient-record-view";
import "@/styles/patient-record.css";

export const metadata: Metadata = { title: "Patient Health Records" };

export default async function PatientAppPage({ searchParams }: { searchParams: Promise<{ patient?: string }> }) {
  const raw = Number((await searchParams).patient);
  const patientIndex = Number.isFinite(raw) ? Math.min(2, Math.max(0, Math.trunc(raw))) : 0;
  return (
    <div className="patient-page">
      <main className="patient-shell">
        <div className="patient-nav">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/lifecome-live-logo.svg" alt="LifeCome Live" height={28} className="patient-logo" />
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/#dashboard">Professional portal</a>
        </div>
        <PatientRecordView patientIndex={patientIndex} />
      </main>
    </div>
  );
}
