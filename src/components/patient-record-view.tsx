"use client";

import { useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "lifecome-shared-patient-preview-v1";

interface PatientRecord {
  patient: { name: string; id: string };
  consultation?: { summary: string; followup: string; author: string; signedAt: string } | null;
  prescription?: { status: string; medicine: string; directions: string } | null;
  result?: { explanation: string; action: string; due: string } | null;
  observations?: { bp: string; pulse: string; temperature: string } | null;
  referral?: { specialty: string; status: string } | null;
  care?: { delivered: string; handover: string } | null;
  wellbeing?: { goal: string; plan: string } | null;
  messages: { author: string; text: string }[];
  updatedAt: string;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("focus", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("focus", callback);
  };
}

const readRaw = () => localStorage.getItem(STORAGE_KEY) ?? "";
const readServer = () => null;

function parseRecord(raw: string, index: number): PatientRecord | null {
  try {
    return JSON.parse(raw)?.patients?.[index] ?? null;
  } catch {
    return null;
  }
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <>
      <h3>{label}</h3>
      <p>{value}</p>
    </>
  );
}

function Section({ title, empty, children }: { title: string; empty: string; children?: React.ReactNode }) {
  return (
    <section className="record-section">
      <h2>{title}</h2>
      {children ?? <p>{empty}</p>}
    </section>
  );
}

export function PatientRecordView({ patientIndex }: { patientIndex: number }) {
  const raw = useSyncExternalStore(subscribe, readRaw, readServer);
  const record = useMemo(() => (raw === null ? undefined : parseRecord(raw, patientIndex)), [raw, patientIndex]);

  if (record === undefined) return null;
  if (!record) {
    return (
      <>
        <h1>Your health records</h1>
        <p>Open the professional portal first to load the connected record.</p>
      </>
    );
  }

  const { consultation, prescription, result, observations, referral, care, wellbeing } = record;
  return (
    <>
      <div className="eyebrow">PATIENT APP</div>
      <h1>Your health records</h1>
      <p className="sub">
        {record.patient.name} · {record.patient.id}
      </p>
      <div className="banner">Updates released in the professional portal appear here automatically.</div>

      <Section title="Consultation summary" empty="No consultation summary has been released yet.">
        {consultation && (
          <>
            <Field label="Your consultation" value={consultation.summary} />
            <Field label="Follow-up and safety-netting" value={consultation.followup} />
            <small>
              {consultation.author} · {consultation.signedAt}
            </small>
          </>
        )}
      </Section>
      <Section title="Prescriptions" empty="No authorised prescription is available.">
        {prescription &&
          (prescription.status === "Cancelled" ? (
            <p>The prescription has been cancelled.</p>
          ) : (
            <>
              <Field label="Medicine" value={prescription.medicine} />
              <Field label="Directions" value={prescription.directions} />
              <p>
                <b>Not a real prescription. Nothing has been sent to a pharmacy.</b>
              </p>
            </>
          ))}
      </Section>
      <Section title="Test results" empty="No reviewed test result has been released yet.">
        {result && (
          <>
            <Field label="Your result" value={result.explanation} />
            <Field label="Next step" value={result.action} />
            <Field label="Follow-up due" value={result.due} />
          </>
        )}
      </Section>
      <Section title="Observations" empty="No observations have been recorded.">
        {observations && (
          <>
            <Field label="Blood pressure" value={`${observations.bp} mmHg`} />
            <Field label="Pulse" value={`${observations.pulse} beats/min`} />
            <Field label="Temperature" value={`${observations.temperature} °C`} />
          </>
        )}
      </Section>
      <Section title="Referrals" empty="No referral is available.">
        {referral && (
          <>
            <Field label="Specialty" value={referral.specialty} />
            <Field label="Status" value={referral.status} />
          </>
        )}
      </Section>
      <Section title="Care visit summary" empty="No signed visit summary is available.">
        {care && (
          <>
            <Field label="Support provided" value={care.delivered} />
            <Field label="Next steps" value={care.handover} />
          </>
        )}
      </Section>
      <Section title="Wellbeing plan" empty="No wellbeing plan has been shared.">
        {wellbeing && (
          <>
            <Field label="Your goal" value={wellbeing.goal} />
            <Field label="Your plan" value={wellbeing.plan} />
          </>
        )}
      </Section>
      <Section title="Messages" empty="No new messages.">
        {record.messages.length > 0 && record.messages.map((m, i) => <Field key={i} label={m.author} value={m.text} />)}
      </Section>
      <p className="footer-note">
        Last shared update: {record.updatedAt}
      </p>
    </>
  );
}
