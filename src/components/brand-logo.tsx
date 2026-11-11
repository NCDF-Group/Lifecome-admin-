/** LifeCome Health logo: the brand mark with the wordmark set in brand colours. */
export function BrandLogo({ dark = false, size = "md" }: { dark?: boolean; size?: "sm" | "md" | "lg" }) {
  return (
    <span className={`lc-logo ${dark ? "on-dark" : ""} ${size}`} role="img" aria-label="LifeCome Health">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/lifecome-health-mark.svg" alt="" width={34} height={32} />
      <span className="lc-word">
        <b>Life</b>
        <b>Come</b>
        <b>Health</b>
      </span>
    </span>
  );
}
