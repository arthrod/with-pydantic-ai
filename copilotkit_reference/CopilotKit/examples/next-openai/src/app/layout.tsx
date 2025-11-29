import "../styles/globals.css";
import "@copilotkit/react-ui/styles.css";
import "@copilotkit/react-textarea/styles.css";
import { ServiceAdapterSelector } from "./components/ServiceAdapterSelector";
import { Suspense } from "react";

/**
 * Renders the application's root HTML layout and wraps page content in a Suspense boundary.
 *
 * @param children - Page content to render inside the body.
 * @returns The root HTML structure containing the body with a Suspense fallback and the service adapter selector.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-zinc-900">
      <body>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
          <ServiceAdapterSelector />
        </Suspense>
      </body>
    </html>
  );
}