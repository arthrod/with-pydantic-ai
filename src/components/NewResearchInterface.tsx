"use client";

import React, { useState } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { AgentProgressSidebar } from "@/components/AgentProgressSidebar";

interface ResearchStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "active" | "completed" | "error";
  type: "thinking" | "tool" | "subtask" | "output";
  details?: string;
  timestamp?: string | Date;
}

export function NewResearchInterface() {
  const [steps, setSteps] = useState<ResearchStep[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatInterface 
          onStepsUpdate={setSteps}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />
      </div>
      
      {/* Right Sidebar */}
      <div className="w-80 flex-shrink-0">
        <AgentProgressSidebar 
          steps={steps}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
} 