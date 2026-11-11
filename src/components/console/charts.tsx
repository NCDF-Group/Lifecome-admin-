import { fmtDay } from "@/lib/format";

interface Point {
  day: string;
  value: number;
}

const W = 640;

export function AreaChart({ data, color = "#0667b8", height = 200, label }: { data: Point[]; color?: string; height?: number; label: string }) {
  const padL = 30, padR = 8, padT = 12, padB = 24;
  const max = Math.max(4, ...data.map((d) => d.value));
  const niceMax = Math.ceil(max / 4) * 4;
  const x = (i: number) => padL + (i / Math.max(1, data.length - 1)) * (W - padL - padR);
  const y = (v: number) => padT + (1 - v / niceMax) * (height - padT - padB);
  const line = data.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(" ");
  const area = `${line} L${x(data.length - 1).toFixed(1)},${height - padB} L${x(0).toFixed(1)},${height - padB} Z`;
  const id = `g${label.replace(/\W/g, "")}`;
  const total = data.reduce((s, d) => s + d.value, 0);
  const ticks = [0, 0.5, 1].map((t) => Math.round(niceMax * t));
  return (
    <figure className="c-chart" aria-label={`${label}: ${total} in total`}>
      <svg viewBox={`0 0 ${W} ${height}`} role="img">
        <defs>
          <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity=".22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} className="grid" />
            <text x={padL - 8} y={y(t) + 4} textAnchor="end" className="axis">{t}</text>
          </g>
        ))}
        <path d={area} fill={`url(#${id})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
        {data.map((d, i) => (
          <g key={d.day}>
            <rect x={x(i) - (W / data.length) / 2} y={padT} width={W / data.length} height={height - padT - padB} fill="transparent">
              <title>{`${fmtDay(d.day)}: ${d.value}`}</title>
            </rect>
            {d.value > 0 && <circle cx={x(i)} cy={y(d.value)} r="3" fill="#fff" stroke={color} strokeWidth="2" />}
          </g>
        ))}
        {[0, Math.floor((data.length - 1) / 2), data.length - 1].map((i) => (
          <text key={i} x={x(i)} y={height - 6} textAnchor={i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"} className="axis">
            {fmtDay(data[i].day)}
          </text>
        ))}
      </svg>
    </figure>
  );
}

export function BarChart({ data, color = "#45af03", height = 180, label }: { data: Point[]; color?: string; height?: number; label: string }) {
  const padL = 30, padR = 8, padT = 12, padB = 24;
  const max = Math.max(4, ...data.map((d) => d.value));
  const niceMax = Math.ceil(max / 4) * 4;
  const slot = (W - padL - padR) / data.length;
  const bw = Math.max(3, slot * 0.62);
  const y = (v: number) => padT + (1 - v / niceMax) * (height - padT - padB);
  return (
    <figure className="c-chart" aria-label={label}>
      <svg viewBox={`0 0 ${W} ${height}`} role="img">
        {[0, 0.5, 1].map((t) => {
          const v = Math.round(niceMax * t);
          return (
            <g key={t}>
              <line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} className="grid" />
              <text x={padL - 8} y={y(v) + 4} textAnchor="end" className="axis">{v}</text>
            </g>
          );
        })}
        {data.map((d, i) => (
          <rect key={d.day} x={padL + i * slot + (slot - bw) / 2} y={y(d.value)} width={bw} height={Math.max(0, height - padB - y(d.value))} rx="3" fill={color} opacity={d.value ? 1 : 0.15}>
            <title>{`${fmtDay(d.day)}: ${d.value}`}</title>
          </rect>
        ))}
        {[0, Math.floor((data.length - 1) / 2), data.length - 1].map((i) => (
          <text key={i} x={padL + i * slot + slot / 2} y={height - 6} textAnchor={i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"} className="axis">
            {fmtDay(data[i].day)}
          </text>
        ))}
      </svg>
    </figure>
  );
}

export function Donut({ segments, centre }: { segments: { label: string; value: number; color: string }[]; centre: { value: string | number; label: string } }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const R = 52, C = 2 * Math.PI * R;
  let offset = 0;
  return (
    <div className="c-donut">
      <svg viewBox="0 0 140 140" role="img" aria-label="Team members by role">
        <circle cx="70" cy="70" r={R} fill="none" stroke="#edf2f7" strokeWidth="16" />
        {total > 0 &&
          segments.filter((s) => s.value > 0).map((s) => {
            const len = (s.value / total) * C;
            const el = <circle key={s.label} cx="70" cy="70" r={R} fill="none" stroke={s.color} strokeWidth="16" strokeDasharray={`${Math.max(0, len - 2)} ${C}`} strokeDashoffset={-offset} transform="rotate(-90 70 70)"><title>{`${s.label}: ${s.value}`}</title></circle>;
            offset += len;
            return el;
          })}
        <text x="70" y="68" textAnchor="middle" className="donut-v">{centre.value}</text>
        <text x="70" y="85" textAnchor="middle" className="donut-l">{centre.label}</text>
      </svg>
      <ul>
        {segments.map((s) => (
          <li key={s.label}>
            <i style={{ background: s.color }} />
            <span>{s.label}</span>
            <b>{s.value}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HBars({ rows }: { rows: { label: string; value: number; color: string }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="c-hbars">
      {rows.map((r) => (
        <li key={r.label}>
          <span>{r.label}</span>
          <div>
            <i style={{ width: `${(r.value / max) * 100}%`, background: r.color }} />
          </div>
          <b>{r.value}</b>
        </li>
      ))}
    </ul>
  );
}
