/**
 * Determines whether the current environment is a localhost-like host.
 *
 * @returns `true` if `window` exists and the hostname is "localhost", "127.0.0.1", or "0.0.0.0"; `false` otherwise.
 */
function isLocalhost(): boolean {
  if (typeof window === "undefined") return false;

  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "0.0.0.0"
  );
}

/**
 * Decide whether the development console should be shown.
 *
 * @param showDevConsole - If provided, forces the result to this value; if omitted, defaults to showing the dev console when running on localhost.
 * @returns `true` if the development console should be shown, `false` otherwise.
 */
export function shouldShowDevConsole(showDevConsole?: boolean): boolean {
  // If explicitly set, use that value
  if (showDevConsole !== undefined) {
    return showDevConsole;
  }

  // If not set, default to true on localhost
  return isLocalhost();
}