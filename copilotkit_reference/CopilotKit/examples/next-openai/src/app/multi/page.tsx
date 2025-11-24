"use client";

import { CopilotChat } from "@copilotkit/react-ui";
import "./styles.css";
import { CopilotKit, useCopilotAction, useCopilotChat } from "@copilotkit/react-core";
import { useSearchParams } from "next/navigation";
import { MessageRole, TextMessage } from "@copilotkit/runtime-client-gql";
import { randomId } from "@copilotkit/shared";

const testMessages = [
  {
    name: "Multiple of the same action",
    message:
      "Get the weather 3 times all at once, you decide everything. Do not ask me for anything. At the end, tell me what the weather was between them.",
  },
  {
    name: "Multiple different actions",
    message:
      "Get the weather and the hotel all at once, you decide everything. Do not ask me for anything. At the end, tell me what the weather and hotel was.",
  },
  {
    name: "Multiple HITL actions and non-hitl actions",
    message:
      "Get the weather, hotel and flight all at once, you decide everything. Do not ask me for anything.",
  },
  {
    name: "Add a message",
    message: "Add a message via your tool. Do not ask me for anything.",
  },
];

/**
 * Client-side page component that configures a CopilotKit instance from URL search parameters and renders the TravelPlanner within it.
 *
 * Reads `serviceAdapter`, `runtimeUrl`, and `publicApiKey` from the current URL search params. If `serviceAdapter` is not provided it defaults to `"openai"`. If `runtimeUrl` is not provided it defaults to `/api/copilotkit?serviceAdapter=<serviceAdapter>`.
 *
 * @returns A React element that renders a CopilotKit wrapper configured from URL search parameters and the TravelPlanner component inside it.
 */
export default function PanelPage() {
  const searchParams = useSearchParams();
  const serviceAdapter = searchParams.get("serviceAdapter") || "openai";
  const runtimeUrl =
    searchParams.get("runtimeUrl") || `/api/copilotkit?serviceAdapter=${serviceAdapter}`;
  const publicApiKey = searchParams.get("publicApiKey");
  const copilotKitProps: Partial<React.ComponentProps<typeof CopilotKit>> = {
    runtimeUrl,
    publicApiKey: publicApiKey || undefined,
  };

  return (
    <CopilotKit {...copilotKitProps}>
      <TravelPlanner />
    </CopilotKit>
  );
}

/**
 * Renders a travel-planner UI that integrates with CopilotKit and registers demo actions.
 *
 * This React component registers several Copilot actions (flight, image, weather, hotel, and add-message),
 * exposes a CopilotChat panel configured for a travel-planner assistant, and renders buttons that append
 * predefined test user messages to the chat.
 *
 * @returns A JSX element containing the CopilotChat interface and a column of buttons to trigger test messages and actions.
 */
function TravelPlanner() {
  const { appendMessage } = useCopilotChat();

  // regular action
  useCopilotAction({
    name: "getFlight",
    followUp: false,
    render() {
      return <div>Flight</div>;
    },
  });

  // backend action
  useCopilotAction({
    name: "getImageUrl",
    followUp: true,
    render() {
      return <div>Image</div>;
    },
  });

  // hitl action 1
  useCopilotAction({
    name: "getWeather",
    renderAndWaitForResponse({ status, respond }) {
      return (
        <div className="flex flex-col gap-2 bg-blue-500/50 p-4 border border-blue-500 rounded-md w-1/2">
          <p>Weather</p>
          <p>Status: {status}</p>
          {status !== "complete" && (
            <button
              className="bg-blue-500 text-white p-2 rounded-md"
              onClick={() => respond?.("the weather is 70 degrees")}
            >
              Continue
            </button>
          )}
        </div>
      );
    },
  });

  // hitl action 2
  useCopilotAction({
    name: "getHotel",
    renderAndWaitForResponse({ status, args, respond }) {
      return (
        <div className="flex flex-col gap-2 bg-blue-500/50 p-4 border border-blue-500 rounded-md w-1/2">
          <p>Hotel</p>
          <p>Status: {status}</p>
          {status !== "complete" && (
            <button
              className="bg-blue-500 text-white p-2 rounded-md"
              onClick={() => respond?.("Marriott")}
            >
              Continue
            </button>
          )}
        </div>
      );
    },
  });

  // add a message with followUp false
  useCopilotAction({
    name: "addMessage",
    followUp: false,
    render() {
      return (
        <div className="flex flex-col gap-2 bg-blue-500/50 p-4 border border-blue-500 rounded-md w-1/2">
          <p>Adding a message...</p>
        </div>
      );
    },
    handler: async () => {
      appendMessage(
        {
          id: randomId(),
          role: "assistant",
          content: "What is the weather in San Francisco?",
        },
        {
          followUp: false,
        },
      );
    },
  });

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <CopilotChat
        className="w-4/5 h-4/5 border p-4 rounded-xl border-gray-200"
        labels={{
          initial: "Hi you! 👋 Let's book your next vacation. Ask me anything.",
        }}
        instructions="You are a travel planner. You help the user plan their vacation. After presenting something, don't summarize, but keep the reply short."
      />
      {/* 
          ----------------------------------------------------------------
            Buttons for triggering different cases 
          ----------------------------------------------------------------
        */}
      <div className="flex flex-col gap-2 px-4">
        {testMessages.map((testMessage) => (
          <div key={testMessage.name}>
            <button
              className="bg-blue-500 text-white p-2 rounded-md"
              onClick={() =>
                appendMessage({
                  id: randomId(),
                  role: "user",
                  content: testMessage.message,
                })
              }
            >
              {testMessage.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}