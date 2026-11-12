/** Two-step progress indicator: 1 Verify → 2 New password. */
export function Steps({ current }: { current: 1 | 2 }) {
  return (
    <ol className="a-steps" aria-label="Progress">
      {["Verify", "New password"].map((label, i) => {
        const n = i + 1;
        const state = n < current ? "done" : n === current ? "current" : "todo";
        return (
          <li key={label} className={state} aria-current={state === "current" ? "step" : undefined}>
            <span>{state === "done" ? "✓" : n}</span>
            {label}
          </li>
        );
      })}
    </ol>
  );
}
