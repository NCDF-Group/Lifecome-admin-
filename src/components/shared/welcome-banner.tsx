import Image from "next/image";

/** The Dashboard's welcome strip. Reuses the same team photo as the login
 * page rather than a stock image of a specific (fake) person, since
 * nothing here claims to depict a real named patient or provider. */
export function WelcomeBanner() {
  return (
    <div className="relative flex h-32 items-center overflow-hidden rounded-card sm:h-40">
      <Image
        src="/images/team-doctors.webp"
        alt=""
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-strong/90 via-blue-strong/60 to-transparent" />
      <div className="relative z-10 flex flex-col gap-1 px-5 sm:px-8">
        <p className="text-lg font-bold text-white sm:text-xl">
          Welcome back
        </p>
        <p className="max-w-xs text-sm text-white/85">
          Here is what is happening across LifeCome Live right now.
        </p>
      </div>
    </div>
  );
}
