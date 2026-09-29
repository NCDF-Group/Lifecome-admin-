import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merges Tailwind classes, letting a later class win over an earlier
 * conflicting one - the standard shadcn/ui helper, used by every
 * component in `components/ui`. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
