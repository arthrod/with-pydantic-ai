import React, { useCallback } from "react";
import { GraphQLError } from "@copilotkit/runtime-client-gql";
import { useToast } from "../toast/toast-provider";
import { ExclamationMarkIcon } from "../toast/exclamation-mark-icon";
import ReactMarkdown from "react-markdown";

interface OriginalError {
  message?: string;
  stack?: string;
}

/**
 * Renders a toast showing one or more errors, each with an optional runtime code and a markdown-formatted message.
 *
 * Each rendered entry prefers `extensions.originalError.message` when present and displays `extensions.code` as
 * a labeled "Copilot Runtime Error" code block. A small note indicates the toast is for local development only.
 *
 * @param errors - Array of `Error` or `GraphQLError` objects to display
 * @returns A React element containing the formatted error list and a development-only note
 */
export function ErrorToast({ errors }: { errors: (Error | GraphQLError)[] }) {
  const errorsToRender = errors.map((error, idx) => {
    const originalError =
      "extensions" in error ? (error.extensions?.originalError as undefined | OriginalError) : {};
    const message = originalError?.message ?? error.message;
    const code = "extensions" in error ? (error.extensions?.code as string) : null;

    return (
      <div
        key={idx}
        style={{
          marginTop: idx === 0 ? 0 : 10,
          marginBottom: 14,
        }}
      >
        <ExclamationMarkIcon style={{ marginBottom: 4 }} />

        {code && (
          <div
            style={{
              fontWeight: "600",
              marginBottom: 4,
            }}
          >
            Copilot Runtime Error:{" "}
            <span style={{ fontFamily: "monospace", fontWeight: "normal" }}>{code}</span>
          </div>
        )}
        <ReactMarkdown>{message}</ReactMarkdown>
      </div>
    );
  });
  return (
    <div
      style={{
        fontSize: "13px",
        maxWidth: "600px",
      }}
    >
      {errorsToRender}
      <div style={{ fontSize: "11px", opacity: 0.75 }}>
        NOTE: This error only displays during local development.
      </div>
    </div>
  );
}

/**
 * Creates a memoized callback to display a consolidated error toast for multiple errors.
 *
 * @returns A function that accepts `errors: (Error | GraphQLError)[]` and displays a deduplicated error toast whose content lists the provided errors.
 */
export function useErrorToast() {
  const { addToast } = useToast();

  return useCallback(
    (error: (Error | GraphQLError)[]) => {
      const errorId = error
        .map((err) => {
          const message =
            "extensions" in err
              ? (err.extensions?.originalError as any)?.message || err.message
              : err.message;
          const stack = err.stack || "";
          return btoa(message + stack).slice(0, 32); // Create hash from message + stack
        })
        .join("|");

      addToast({
        type: "error",
        id: errorId, // Toast libraries typically dedupe by id
        message: <ErrorToast errors={error} />,
      });
    },
    [addToast],
  );
}

/**
 * Wraps an async function with a memoized wrapper that displays an error toast on rejection and rethrows the error.
 *
 * @param callback - The asynchronous function to wrap.
 * @param deps - Dependency array forwarded to `useCallback` to control memoization.
 * @returns A memoized function that invokes `callback` with the provided arguments, shows an error toast if it throws, and rethrows the error.
 */
export function useAsyncCallback<T extends (...args: any[]) => Promise<any>>(
  callback: T,
  deps: Parameters<typeof useCallback>[1],
) {
  const addErrorToast = useErrorToast();
  return useCallback(async (...args: Parameters<T>) => {
    try {
      return await callback(...args);
    } catch (error) {
      console.error("Error in async callback:", error);
      // @ts-ignore
      addErrorToast([error]);
      throw error;
    }
  }, deps);
}