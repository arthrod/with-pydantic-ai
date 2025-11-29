import "../styles/globals.css";
import type { AppProps } from "next/app";

/**
 * Renders the active Next.js page component with its initial props.
 *
 * @param Component - The page component to render.
 * @param pageProps - Props to pass to the page component.
 * @returns The rendered page component element.
 */
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}