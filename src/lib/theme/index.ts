/** The operator's theme choice. `system` follows the OS and updates live when the OS switches. */
export type ThemePreference = "system" | "light" | "dark";

/** Stored as a cookie, not localStorage, so the server renders `data-theme` on the first byte and
 * no choice ever flashes the other theme. `system` is resolved by a media query in globals.css. */
export const THEME_COOKIE = "lc_theme";

export function isThemePreference(value: string | null | undefined): value is ThemePreference {
  return value === "system" || value === "light" || value === "dark";
}

/** Applies a new choice to the open page immediately; the cookie makes it stick for later loads. */
export function applyThemePreference(preference: ThemePreference): void {
  document.documentElement.dataset.theme = preference;
  document.cookie = `${THEME_COOKIE}=${preference}; path=/; max-age=31536000; samesite=lax`;
}
