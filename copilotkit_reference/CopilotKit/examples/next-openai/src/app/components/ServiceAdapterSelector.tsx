"use client";

import { useSearchParams } from "next/navigation";

/**
 * Renders a bottom-fixed selector for choosing the current service adapter.
 *
 * The component reads the current adapter from the `serviceAdapter` query parameter (defaults to `"openai"`), and updates the same query parameter and navigates when the selection changes. If a `publicApiKey` query parameter is present, the component renders `null`.
 *
 * @returns The selector JSX element, or `null` when the `publicApiKey` query parameter is present.
 */
export function ServiceAdapterSelector() {
  const searchParams = useSearchParams();
  const serviceAdapter = searchParams.get("serviceAdapter") || "openai";

  if (searchParams.has("publicApiKey")) {
    return null;
  }

  const handleChange = (e) => {
    const value = e.target.value;
    const url = new URL(window.location.href);
    url.searchParams.set("serviceAdapter", value);
    window.location.href = url.toString();
  };

  return (
    <div className="fixed bottom-0 p-4 z-50">
      <div className="bg-white shadow-md border-black/50 border p-2 rounded-md text-black">
        <select value={serviceAdapter} onChange={handleChange}>
          <option value="openai">OpenAI</option>
          <option value="azure_openai">Azure OpenAI</option>
          <option value="anthropic">Anthropic</option>
          <option value="gemini">Gemini</option>
          {/* <option value="azure">Azure</option> */}
          <option value="langchain_openai">LangChain (OpenAI)</option>
          <option value="langchain_anthropic">LangChain (Anthropic)</option>
          <option value="groq">Groq</option>
          <option value="bedrock">Amazon Bedrock</option>
        </select>
      </div>
    </div>
  );
}