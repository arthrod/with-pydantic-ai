"use client";

import React from "react";

interface ResearchStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "active" | "completed" | "error";
  type: "thinking" | "tool" | "subtask" | "output";
  details?: string;
  timestamp?: string | Date;
}

interface AgentProgressSidebarProps {
  steps: ResearchStep[];
  isProcessing: boolean;
}

export function AgentProgressSidebar({ steps, isProcessing }: AgentProgressSidebarProps) {
  return (
    <div className="bg-white border-l border-gray-200 h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Agent Progress</h2>
        <p className="text-xs text-gray-600 mb-3">Real-time updates via AG-UI protocol</p>
        {steps.filter(s => s.status !== "pending").length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{steps.filter(s => s.status === "completed").length}/{steps.filter(s => s.status !== "pending").length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(steps.filter(s => s.status === "completed").length / steps.filter(s => s.status !== "pending").length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Processing indicator */}
      {isProcessing && (
        <div className="p-4">
          <div className="flex items-center space-x-2 text-blue-700">
            <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-xs font-medium">Agent processing...</span>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            Executing research steps with real-time AG-UI updates
          </p>
        </div>
      )}

      {/* Backend response log cards */}
      {steps.length > 0 && (
        <div className="p-4 space-y-2">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Backend Responses</h3>
          {steps.filter(step => step.status !== "pending").map((step) => (
            <div key={step.id} className="bg-gray-50 border border-gray-200 rounded p-3">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-medium text-gray-700">{step.title}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  step.status === "completed" ? "bg-green-100 text-green-700" :
                  step.status === "active" ? "bg-blue-100 text-blue-700" :
                  step.status === "error" ? "bg-red-100 text-red-700" :
                  "bg-gray-100 text-gray-700"
                }`}>
                  {step.status}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-1">{step.description}</p>
              {step.details && (
                <p className="text-xs text-gray-500 italic">{step.details}</p>
              )}
              {step.timestamp && (
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(step.timestamp).toLocaleTimeString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 