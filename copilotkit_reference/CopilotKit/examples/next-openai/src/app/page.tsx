"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { VacationList } from "./components/vacation-list";
import { useSearchParams } from "next/navigation";

/**
 * Render the WaterBnb page configured from URL query parameters.
 *
 * Reads the `serviceAdapter`, `runtimeUrl`, and optional `publicApiKey` search parameters:
 * - `serviceAdapter` defaults to `"openai"` if absent.
 * - `runtimeUrl` defaults to `/api/copilotkit?serviceAdapter=<serviceAdapter>` if absent.
 * - `publicApiKey` is used when present.
 *
 * The component mounts CopilotKit with those derived props (and `showDevConsole: true`),
 * and renders a CopilotSidebar (with image uploads enabled and simple thumbs up/down logging)
 * that contains the VacationList component.
 *
 * @returns The React element for the WaterBnb page: CopilotKit wrapping a CopilotSidebar with VacationList.
 */
export default function WaterBnb() {
  const searchParams = useSearchParams();
  const serviceAdapter = searchParams.get("serviceAdapter") || "openai";

  const runtimeUrl =
    searchParams.get("runtimeUrl") || `/api/copilotkit?serviceAdapter=${serviceAdapter}`;
  const publicApiKey = searchParams.get("publicApiKey");
  const copilotKitProps: Partial<React.ComponentProps<typeof CopilotKit>> = {
    runtimeUrl,
    publicApiKey: publicApiKey || undefined,
    showDevConsole: true,
  };

  return (
    <CopilotKit {...copilotKitProps}>
      <CopilotSidebar
        onThumbsUp={(message) => {
          console.log("thumbs up", message);
        }}
        onThumbsDown={(message) => {
          console.log("thumbs down", message);
        }}
        imageUploadsEnabled={true}
      >
        <VacationList />
      </CopilotSidebar>
    </CopilotKit>
  );
}