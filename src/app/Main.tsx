import { ResearchCanvas } from "@/components/ResearchCanvas";
import { AgentState } from "@/lib/types";
import { useCoAgent } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import { useCopilotChatSuggestions } from "@copilotkit/react-ui";

export default function Main() {
  const { state, setState } = useCoAgent<AgentState>({
    name: "basic_agent",
    initialState: {
      model: "openai",
      message: "",
      logs: [],
      thinking_count: 0,
      last_thought: "",
    },
  });

  useCopilotChatSuggestions({
    instructions: "Ask me to think deeply about something",
  });

  return (
    <>
      <div className="flex h-screen">
        {/* Left Panel - Chat Interface */}
        <div className="w-1/2 border-r border-gray-200">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h1 className="
                text-2xl font-bold text-gray-900
                bg-gradient-to-r from-blue-600 to-purple-600 
                bg-clip-text text-transparent
              ">
                Basic Agent Chat
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Chat with the basic agent and watch it think deeply
              </p>
            </div>
            <div className="flex-1 overflow-hidden">
              <CopilotChat
                className="h-full"
              />
            </div>
          </div>
        </div>

        {/* Right Panel - Canvas */}
        <div className="w-1/2">
          <ResearchCanvas />
        </div>
      </div>
    </>
  );
}
