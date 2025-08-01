"use client";

import React from "react";
import { CopilotChat } from "@copilotkit/react-ui";
import { useCoAgent } from "@copilotkit/react-core";

interface ResearchStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "active" | "completed" | "error";
  type: "thinking" | "tool" | "subtask" | "output";
  details?: string;
  timestamp?: string | Date;
}

interface ResearchState {
  query: string;
  steps: ResearchStep[];
  current_step_index: number;
  search_results: Array<{
    title: string;
    body: string;
    href: string;
  }>;
  content_analysis: string;
  synthesis: string;
  fact_verification: string;
  final_output: string;
  completed: boolean;
}

interface ChatInterfaceProps {
  onStepsUpdate: (steps: ResearchStep[] | ((prevSteps: ResearchStep[]) => ResearchStep[])) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export function ChatInterface({ onStepsUpdate, isProcessing, setIsProcessing }: ChatInterfaceProps) {
  // Use the AG-UI agent integration to get real-time state updates from the research agent
  const { state } = useCoAgent<ResearchState>({
    name: "research_agent", // This should match the agent name in our API route
    initialState: {
      query: "",
      steps: [],
      current_step_index: 0,
      search_results: [],
      content_analysis: "",
      synthesis: "",
      fact_verification: "",
      final_output: "",
      completed: false,
    },
  });

  // Update the parent component with real agent steps whenever they change
  React.useEffect(() => {
    if (state?.steps) {
      onStepsUpdate(state.steps);
    }
  }, [state?.steps, onStepsUpdate]);

  // Update processing state based on real agent completion status
  React.useEffect(() => {
    if (state && state.steps) {
      const hasActiveStep = state.steps.some(step => step.status === "active");
      const isCompleted = state.completed;
      setIsProcessing(hasActiveStep && !isCompleted);
    }
  }, [state, setIsProcessing]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <h1 className="text-xl font-semibold text-gray-900">AI Research Assistant</h1>
        <p className="text-sm text-gray-600">Deep research with real-time agent visualization using AG-UI protocol</p>
      </div>

      {/* CopilotKit Chat Component - connected to real AG-UI agent */}
      <div className="flex-1 min-h-0">
        <CopilotChat
          instructions="You are a comprehensive research assistant. When asked a question, start by calling the start_research tool with the user's query, then follow the complete research workflow: deep_think_analyze_query, web_search, analyze_content, synthesize_information, verify_facts, and generate_final_output. Always provide detailed, thorough research with real web search results."
          className="h-full"
          labels={{
            title: "AI Research Assistant", 
            initial: "Ask me any research question and I'll conduct comprehensive analysis with full transparency of my thought process. All research steps are shown in real-time via the AG-UI protocol.",
          }}
        />
      </div>
    </div>
  );
} 