import { useCopilotContext } from "../context";
import React, { useCallback } from "react";
import { executeConditions } from "@copilotkit/shared";

type InterruptProps = {
  event: any;
  result: any;
  render: (props: {
    event: any;
    result: any;
    resolve: (response: string) => void;
  }) => string | React.ReactElement;
  resolve: (response: string) => void;
};

const InterruptRenderer: React.FC<InterruptProps> = ({ event, result, render, resolve }) => {
  return render({ event, result, resolve });
};

/**
 * Render a configured language-graph interrupt UI when an active, enabled interrupt action exists in the Copilot context.
 *
 * If an interrupt action is present and its `enabled` predicate (when provided) allows rendering, the hook invokes an optional `handler` with `{ event, resolve }` and then returns the value produced by the interrupt action's `render` prop wrapped in an InterruptRenderer. The provided `resolve` callback captures a response and schedules a context update on the next tick to propagate that response.
 *
 * @returns The string or React element produced by the interrupt action's `render` function, or `null` when no interrupt is active or enabled.
 */
export function useLangGraphInterruptRender(): string | React.ReactElement | null {
  const { langGraphInterruptAction, setLangGraphInterruptAction, agentSession } =
    useCopilotContext();

  const responseRef = React.useRef<string>();
  const resolveInterrupt = useCallback(
    (response: string) => {
      responseRef.current = response;
      // Use setTimeout to defer the state update to next tick
      setTimeout(() => {
        setLangGraphInterruptAction({ event: { response } });
      }, 0);
    },
    [setLangGraphInterruptAction],
  );

  if (
    !langGraphInterruptAction ||
    !langGraphInterruptAction.event ||
    !langGraphInterruptAction.render
  )
    return null;

  const { render, handler, event, enabled } = langGraphInterruptAction;

  const conditionsMet =
    !agentSession || !enabled
      ? true
      : enabled({ eventValue: event.value, agentMetadata: agentSession });
  if (!conditionsMet) {
    return null;
  }

  let result = null;
  if (handler) {
    result = handler({
      event,
      resolve: resolveInterrupt,
    });
  }

  return React.createElement(InterruptRenderer, {
    event,
    result,
    render,
    resolve: resolveInterrupt,
  });
}