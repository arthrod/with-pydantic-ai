/**
 * Selects and returns a concrete service adapter implementation for the given service name.
 *
 * @param name - The service identifier; supported values: "openai", "azure_openai", "anthropic", "gemini", "groq", "langchain_openai", "langchain_anthropic", "bedrock"
 * @returns An adapter instance configured for the requested service
 * @throws Error if `name` does not match any supported service adapter
 */
export async function getServiceAdapter(name: string) {
  switch (name) {
    case "openai":
      return getOpenAIAdapter();
    case "azure_openai":
      return getAzureOpenAIAdapter();
    case "anthropic":
      return getAnthropicAdapter();
    case "gemini":
      return getGeminiAdapter();
    case "groq":
      return getGroqAdapter();
    case "langchain_openai":
      return getLangChainOpenAIAdapter();
    case "langchain_anthropic":
      return getLangChainAnthropicAdapter();
    case "bedrock":
      return getBedrockAdapter();
    default:
      throw new Error(`Service adapter "${name}" not found`);
  }
}

/**
 * Create a new OpenAIAdapter instance from @copilotkit/runtime.
 *
 * @returns A newly constructed `OpenAIAdapter` instance
 */
async function getOpenAIAdapter() {
  const { OpenAIAdapter } = await import("@copilotkit/runtime");
  return new OpenAIAdapter();
}

/**
 * Creates an OpenAI adapter configured for Azure OpenAI.
 *
 * @returns An OpenAIAdapter initialized with an OpenAI client that uses `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_INSTANCE`, and `AZURE_OPENAI_MODEL` from the environment and sets the API version to `"2024-04-01-preview"`.
 */
async function getAzureOpenAIAdapter() {
  const { OpenAIAdapter } = await import("@copilotkit/runtime");
  const { OpenAI } = await import("openai");
  const openai = new OpenAI({
    apiKey: process.env["AZURE_OPENAI_API_KEY"],
    baseURL: `https://${process.env["AZURE_OPENAI_INSTANCE"]}.openai.azure.com/openai/deployments/${process.env["AZURE_OPENAI_MODEL"]}`,
    defaultQuery: { "api-version": "2024-04-01-preview" },
    defaultHeaders: { "api-key": process.env["AZURE_OPENAI_API_KEY"] },
  });
  return new OpenAIAdapter({ openai });
}

/**
 * Create an Anthropic adapter configured to use the Claude model "claude-3-7-sonnet-20250219".
 *
 * @returns An initialized AnthropicAdapter configured for the "claude-3-7-sonnet-20250219" model
 */
async function getAnthropicAdapter() {
  const { AnthropicAdapter } = await import("@copilotkit/runtime");
  return new AnthropicAdapter({ model: "claude-3-7-sonnet-20250219" });
}

/**
 * Creates and returns a Google Gemini (Generative AI) adapter instance.
 *
 * @returns An instance of `GoogleGenerativeAIAdapter`
 */
async function getGeminiAdapter() {
  const { GoogleGenerativeAIAdapter } = await import("@copilotkit/runtime");
  return new GoogleGenerativeAIAdapter();
}

/**
 * Creates and returns a Groq adapter instance.
 *
 * @returns A new GroqAdapter instance.
 */
async function getGroqAdapter() {
  const { GroqAdapter } = await import("@copilotkit/runtime");
  return new GroqAdapter();
}

/**
 * Creates a LangChain-based adapter that streams chat responses from a ChatOpenAI model.
 *
 * @returns A LangChainAdapter configured to stream model output for provided messages and tools; streamed responses include metadata with `conversation_id` set to the supplied `threadId`.
 */
async function getLangChainOpenAIAdapter() {
  const { LangChainAdapter } = await import("@copilotkit/runtime");
  const { ChatOpenAI } = await import("@langchain/openai");
  return new LangChainAdapter({
    chainFn: async ({ messages, tools, threadId }) => {
      const model = new ChatOpenAI({ modelName: "gpt-4-1106-preview" }).bindTools(tools, {
        strict: true,
      });
      return model.stream(messages, { tools, metadata: { conversation_id: threadId } });
    },
  });
}

/**
 * Creates a LangChainAdapter that streams responses from an Anthropic Claude model.
 *
 * @returns A LangChainAdapter configured to instantiate a ChatAnthropic model (`modelName: "claude-3-haiku-20240307"`) and stream model output for provided messages and tools; each stream includes metadata with `conversation_id` set to the supplied `threadId`.
 */
async function getLangChainAnthropicAdapter() {
  const { LangChainAdapter } = await import("@copilotkit/runtime");
  const { ChatAnthropic } = await import("@langchain/anthropic");
  return new LangChainAdapter({
    chainFn: async ({ messages, tools, threadId }) => {
      const model = new ChatAnthropic({ modelName: "claude-3-haiku-20240307" }) as any;
      return model.stream(messages, { tools, metadata: { conversation_id: threadId } });
    },
  });
}

/**
 * Creates and returns a new Bedrock adapter instance.
 *
 * @returns A new `BedrockAdapter` instance.
 */
async function getBedrockAdapter() {
  const { BedrockAdapter } = await import("@copilotkit/runtime");
  return new BedrockAdapter();
}