"use client";

import { CopilotKit } from "@copilotkit/react-core";
import Main from "./Main";

export default function Home() {
  // Simple configuration for Pydantic AI agent
  const runtimeUrl = "/api/copilotkit";

  return (
    <CopilotKit runtimeUrl={runtimeUrl} showDevConsole={false}>
      <Main />
    </CopilotKit>
  );
}
