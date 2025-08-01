"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useCoAgent,
  useCoAgentStateRender,
  useCopilotAction,
} from "@copilotkit/react-core";
import { Progress } from "./Progress";
import { AgentState } from "@/lib/types";

export function ResearchCanvas() {
  // Initialize with a more complete state structure
  const initialState: AgentState = {
    model: "openai",
    message: "",
    logs: [],
    thinking_count: 0,
    last_thought: "",
  };

  const { state, setState } = useCoAgent<AgentState>({
    name: "basic_agent",
    initialState,
  });

  // Debug effect to log state changes
  useEffect(() => {
    console.log("=== AgentState updated ===");
    console.log("Full state:", JSON.stringify(state, null, 2));
    console.log("State type:", typeof state);
    console.log("State keys:", Object.keys(state || {}));
    console.log("Thinking count:", state?.thinking_count);
    console.log("Last thought:", state?.last_thought);
    console.log("Logs count:", state?.logs?.length || 0);
    console.log("==========================");
  }, [state]);

  // Debug effect to check if agent is connected
  useEffect(() => {
    console.log("ResearchCanvas mounted, checking agent connection...");
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/copilotkit?agentType=basic_agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            type: 'ping',
            messages: [{ role: 'user', content: 'Hello' }]
          })
        });
        console.log("Agent connection test response:", response.status);
        const data = await response.text();
        console.log("Agent response data:", data.substring(0, 200));
      } catch (error) {
        console.error("Agent connection test failed:", error);
      }
    };
    checkConnection();
  }, []);

  useCoAgentStateRender({
    name: "basic_agent",
    render: ({ state, nodeName, status }) => {
      console.log("useCoAgentStateRender called:", { 
        nodeName, 
        status, 
        state,
        stateType: typeof state,
        stateKeys: Object.keys(state || {})
      });
      if (!state || !state.logs || state.logs.length === 0) {
        return null;
      }
      return <Progress logs={state.logs} />;
    },
  });

  // Fallback state for display
  const displayState = state && Object.keys(state).length > 0 ? state : initialState;

  return (
    <div className="w-full h-full overflow-y-auto p-10 bg-[#F5F8FF]">
      {/* Debug section - temporary */}
      <div className="mb-4 p-2 bg-blue-100 border border-blue-300 rounded text-xs">
        <div>Debug: Logs count = {displayState.logs?.length || 0}</div>
        <div>Debug: Thinking count = {displayState.thinking_count || 0}</div>
        <div>Debug: Last thought = "{displayState.last_thought || "None"}"</div>
        <div>Debug: State object keys = {Object.keys(displayState).join(", ")}</div>
        <div>Debug: State is empty = {Object.keys(displayState).length === 0 ? "Yes" : "No"}</div>
        {displayState.logs && displayState.logs.length > 0 && (
          <div className="mt-1">
            <div>Recent logs:</div>
            {displayState.logs.slice(-3).map((log, index) => (
              <div key={index} className="ml-2">[{log.type}] {log.message}</div>
            ))}
          </div>
        )}
      </div>

      {/* Agent State Display */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-primary">Agent State</h3>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-600">Thinking Count</div>
              <div className="text-2xl font-bold text-blue-600">{displayState.thinking_count}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Last Thought</div>
              <div className="text-sm text-gray-800">{displayState.last_thought || "None"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Widget - Direct Display */}
      {displayState.logs && displayState.logs.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 text-primary">Agent Activity Log</h3>
          <Progress logs={displayState.logs} />
        </div>
      )}

      <div className="space-y-8 pb-10">
        <div>
          <h2 className="text-lg font-medium mb-3 text-primary">
            Message
          </h2>
          <Input
            placeholder="Enter a message"
            value={displayState.message || ""}
            onChange={(e) =>
              setState({ ...displayState, message: e.target.value })
            }
            aria-label="Message"
            className="bg-background px-6 py-8 border-0 shadow-none rounded-xl text-md font-extralight focus-visible:ring-0 placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-col h-full">
          <h2 className="text-lg font-medium mb-3 text-primary">
            Notes
          </h2>
          <Textarea
            placeholder="Add your notes here"
            value={displayState.message || ""}
            onChange={(e) => setState({ ...displayState, message: e.target.value })}
            rows={10}
            aria-label="Notes"
            className="bg-background px-6 py-8 border-0 shadow-none rounded-xl text-md font-extralight focus-visible:ring-0 placeholder:text-slate-400"
            style={{ minHeight: "200px" }}
          />
        </div>
      </div>
    </div>
  );
}
