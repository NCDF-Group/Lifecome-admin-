import Image from "next/image";

/** The wordmark, swapping to the white variant in dark mode. Both are rendered and one is hidden
 * with CSS, so the right one shows on first paint without waiting for client JS. */
export function BrandLogo({ priority = false }: { priority?: boolean }) {
  return (
    <>
      <Image
        src="/brand/lifecome-live-logo.svg"
        alt="LifeCome Live"
        width={140}
        height={28}
        priority={priority}
        className="dark:hidden"
      />
      <Image
        src="/brand/lifecome-live-logo-white.svg"
        alt="LifeCome Live"
        width={140}
        height={28}
        priority={priority}
        className="hidden dark:block"
      />
    </>
  );
}
