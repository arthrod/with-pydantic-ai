import { Html, Head, Main, NextScript } from "next/document";

/**
 * Custom Next.js Document component that defines the root HTML structure for server-rendered pages.
 *
 * @returns A JSX element representing the HTML document: `<Html lang="en">` with `<Head />`, a `<body>` containing `<Main />`, and `<NextScript />`.
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}