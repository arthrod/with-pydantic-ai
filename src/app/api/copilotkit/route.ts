import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { HttpAgent } from "@ag-ui/client";
import { NextRequest } from "next/server";
 
// Create the proper LLM adapter for CopilotKit components
const serviceAdapter = new OpenAIAdapter();

// Create the CopilotRuntime instance with the AG-UI integration
// pointing to our Pydantic AI agent running on port 8000
const runtime = new CopilotRuntime({
  agents: {
    // The agent name should match what's used in the frontend
    "research_agent": new HttpAgent({url: "http://localhost:8000/"}),
  }   
});
 
// Build a Next.js API route that handles the CopilotKit runtime requests
export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime, 
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });
 
  return handleRequest(req);
};