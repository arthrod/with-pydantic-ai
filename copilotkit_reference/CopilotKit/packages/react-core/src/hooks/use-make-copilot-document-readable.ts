import { useEffect, useRef } from "react";
import { useCopilotContext } from "../context/copilot-context";
import { DocumentPointer } from "../types";

/**
 * Register a document with the Copilot context so Copilot can read it.
 *
 * @param document - The document pointer to expose to Copilot
 * @param categories - Optional categories to associate with the document
 * @param dependencies - Additional values that control when the registration effect re-runs
 * @returns The document id assigned by the Copilot context, or `undefined` until the effect registers it
 */
export function useMakeCopilotDocumentReadable(
  document: DocumentPointer,
  categories?: string[],
  dependencies: any[] = [],
): string | undefined {
  const { addDocumentContext, removeDocumentContext } = useCopilotContext();
  const idRef = useRef<string>();

  useEffect(() => {
    const id = addDocumentContext(document, categories);
    idRef.current = id;

    return () => {
      removeDocumentContext(id);
    };
  }, [addDocumentContext, removeDocumentContext, ...dependencies]);

  return idRef.current;
}