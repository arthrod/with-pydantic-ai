import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { HttpAgent } from "@ag-ui/client";
import OpenAI from "openai";
import { NextRequest } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const llmAdapter = new OpenAIAdapter({ openai } as any);

export const POST = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const agentType = searchParams.get("agentType") || "basic_agent";
  
  // Base URL for the Pydantic AI agent using standard AG-UI protocol
  const baseUrl = process.env.PYDANTIC_AI_AGENT_URL || "http://localhost:8000";
  
  console.log(`Connecting to agent: ${agentType} at ${baseUrl}`);
  
  // Create runtime with the Pydantic AI agent using standard AG-UI protocol
  const runtime = new CopilotRuntime({
    agents: {
      [agentType]: new HttpAgent({
        url: baseUrl,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    },
  });

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: llmAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
