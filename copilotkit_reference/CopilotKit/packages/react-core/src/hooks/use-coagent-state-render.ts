/**
 * The useCoAgentStateRender hook allows you to render UI or text based components on a Agentic Copilot's state in the chat.
 * This is particularly useful for showing intermediate state or progress during Agentic Copilot operations.
 *
 * ## Usage
 *
 * ### Simple Usage
 *
 * ```tsx
 * import { useCoAgentStateRender } from "@copilotkit/react-core";
 *
 * type YourAgentState = {
 *   agent_state_property: string;
 * }
 *
 * useCoAgentStateRender<YourAgentState>({
 *   name: "basic_agent",
 *   nodeName: "optionally_specify_a_specific_node",
 *   render: ({ status, state, nodeName }) => {
 *     return (
 *       <YourComponent
 *         agentStateProperty={state.agent_state_property}
 *         status={status}
 *         nodeName={nodeName}
 *       />
 *     );
 *   },
 * });
 * ```
 *
 * This allows for you to render UI components or text based on what is happening within the agent.
 *
 * ### Example
 * A great example of this is in our Perplexity Clone where we render the progress of an agent's internet search as it is happening.
 * You can play around with it below or learn how to build it with its [demo](/coagents/videos/perplexity-clone).
 *
 * <Callout type="info">
 *   This example is hosted on Vercel and may take a few seconds to load.
 * </Callout>
 *
 * <iframe src="https://examples-coagents-ai-researcher-ui.vercel.app/" className="w-full rounded-lg border h-[700px] my-4" />
 */

import { useRef, useContext, useEffect } from "react";
import { CopilotContext } from "../context/copilot-context";
import { randomId, CopilotKitAgentDiscoveryError } from "@copilotkit/shared";
import { CoAgentStateRender } from "../types/coagent-action";
import { useToast } from "../components/toast/toast-provider";

/**
 * This hook is used to render agent state with custom UI components or text. This is particularly
 * useful for showing intermediate state or progress during Agentic Copilot operations.
 * To get started using rendering intermediate state through this hook, checkout the documentation.
 *
 * https://docs.copilotkit.ai/coagents/shared-state/predictive-state-updates
 */

// We implement useCoAgentStateRender dependency handling so that
// the developer has the option to not provide any dependencies.
/**
 * Register a state-rendering action for a named co-agent so UI/text can be rendered for that agent's state and optionally for a specific node.
 *
 * Registers the provided `action` in the global co-agent state render registry and (when supplied) caches its `render` component. If `dependencies` is provided the registration is re-run when those dependencies change; if `dependencies` is omitted the hook updates only the existing handler in place. The hook also validates that the named agent exists (surface a banner error if not), warns via toast when duplicate renders for the same agent/node are detected, and removes the registration on cleanup.
 *
 * @param action - Descriptor of the state render to register. Expected fields include `name` (agent name), optional `nodeName`, `handler`, and optional `render` (component or string key).
 * @param dependencies - Optional dependency list that controls when the registration effect re-runs; when omitted the hook performs a lightweight in-place handler update instead of re-registering.
 */
export function useCoAgentStateRender<T = any>(
  action: CoAgentStateRender<T>,
  dependencies?: any[],
): void {
  const {
    setCoAgentStateRender,
    removeCoAgentStateRender,
    coAgentStateRenders,
    chatComponentsCache,
    availableAgents,
  } = useContext(CopilotContext);
  const idRef = useRef<string>(randomId());
  const { setBannerError, addToast } = useToast();

  useEffect(() => {
    if (availableAgents?.length && !availableAgents.some((a) => a.name === action.name)) {
      const message = `(useCoAgentStateRender): Agent "${action.name}" not found. Make sure the agent exists and is properly configured.`;

      // Route to banner instead of toast for consistency
      const agentError = new CopilotKitAgentDiscoveryError({
        agentName: action.name,
        availableAgents: availableAgents.map((a) => ({ name: a.name, id: a.id })),
      });
      setBannerError(agentError);
    }
  }, [availableAgents]);

  const key = `${action.name}-${action.nodeName || "global"}`;

  if (dependencies === undefined) {
    if (coAgentStateRenders[idRef.current]) {
      coAgentStateRenders[idRef.current].handler = action.handler as any;
      if (typeof action.render === "function") {
        if (chatComponentsCache.current !== null) {
          chatComponentsCache.current.coAgentStateRenders[key] = action.render;
        }
      }
    }
  }

  useEffect(() => {
    // Check for duplicates by comparing against all other actions
    const currentId = idRef.current;
    const hasDuplicate = Object.entries(coAgentStateRenders).some(([id, otherAction]) => {
      // Skip comparing with self
      if (id === currentId) return false;

      // Different agent names are never duplicates
      if (otherAction.name !== action.name) return false;

      // Same agent names:
      const hasNodeName = !!action.nodeName;
      const hasOtherNodeName = !!otherAction.nodeName;

      // If neither has nodeName, they're duplicates
      if (!hasNodeName && !hasOtherNodeName) return true;

      // If one has nodeName and other doesn't, they're not duplicates
      if (hasNodeName !== hasOtherNodeName) return false;

      // If both have nodeName, they're duplicates only if the names match
      return action.nodeName === otherAction.nodeName;
    });

    if (hasDuplicate) {
      const message = action.nodeName
        ? `Found multiple state renders for agent ${action.name} and node ${action.nodeName}. State renders might get overridden`
        : `Found multiple state renders for agent ${action.name}. State renders might get overridden`;

      addToast({
        type: "warning",
        message,
        id: `dup-action-${action.name}`,
      });
    }
  }, [coAgentStateRenders]);

  useEffect(() => {
    setCoAgentStateRender(idRef.current, action as any);
    if (chatComponentsCache.current !== null && action.render !== undefined) {
      chatComponentsCache.current.coAgentStateRenders[key] = action.render;
    }
    return () => {
      removeCoAgentStateRender(idRef.current);
    };
  }, [
    setCoAgentStateRender,
    removeCoAgentStateRender,
    action.name,
    // include render only if it's a string
    typeof action.render === "string" ? action.render : undefined,
    // dependencies set by the developer
    ...(dependencies || []),
  ]);
}