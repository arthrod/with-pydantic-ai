import {
  Action,
  COPILOT_CLOUD_PUBLIC_API_KEY_HEADER,
  MappedParameterTypes,
  Parameter,
  actionParametersToJsonSchema,
} from "@copilotkit/shared";
import {
  ActionExecutionMessage,
  Message,
  Role,
  TextMessage,
  convertGqlOutputToMessages,
  CopilotRequestType,
  ForwardedParametersInput,
} from "@copilotkit/runtime-client-gql";
import { CopilotContextParams, CopilotMessagesContextParams } from "../context";
import { defaultCopilotContextCategories } from "../components";
import { CopilotRuntimeClient } from "@copilotkit/runtime-client-gql";
import {
  convertMessagesToGqlInput,
  filterAgentStateMessages,
} from "@copilotkit/runtime-client-gql";

interface InitialState<T extends Parameter[] | [] = []> {
  status: "initial";
  args: Partial<MappedParameterTypes<T>>;
}

interface InProgressState<T extends Parameter[] | [] = []> {
  status: "inProgress";
  args: Partial<MappedParameterTypes<T>>;
}

interface CompleteState<T extends Parameter[] | [] = []> {
  status: "complete";
  args: MappedParameterTypes<T>;
}

type StreamHandlerArgs<T extends Parameter[] | [] = []> =
  | InitialState<T>
  | InProgressState<T>
  | CompleteState<T>;

interface ExtractOptions<T extends Parameter[]> {
  context: CopilotContextParams & CopilotMessagesContextParams;
  instructions: string;
  parameters: T;
  include?: IncludeOptions;
  data?: any;
  abortSignal?: AbortSignal;
  stream?: (args: StreamHandlerArgs<T>) => void;
  requestType?: CopilotRequestType;
  forwardedParameters?: ForwardedParametersInput;
}

interface IncludeOptions {
  readable?: boolean;
  messages?: boolean;
}

/**
 * Extracts parameter values by invoking the Copilot `extract` action with the given instructions and context, streaming intermediate argument updates and returning the final mapped arguments.
 *
 * @param context - Copilot context and message helpers used to build prompts and access runtime client/config.
 * @param instructions - Task instructions describing what to extract; used as the user-facing prompt and action description.
 * @param parameters - Schema describing the parameters to extract.
 * @param include - Options to include readable context and/or agent state messages in the prompt.
 * @param data - Optional payload appended to the prompt context (string or JSON-serializable object).
 * @param abortSignal - Optional AbortSignal to cancel the streaming request.
 * @param stream - Optional callback invoked with streaming states (`initial`, `inProgress`, `complete`) and partial or full argument mappings.
 * @param requestType - Optional request type included in metadata for the Copilot request (defaults to Task).
 * @param forwardedParameters - Optional additional forwarded parameters passed to the runtime; `toolChoice` and `toolChoiceFunctionName` are added automatically.
 * @returns The final mapped parameter values resolved by the Copilot action for the provided `parameters`.
 * @throws Error - If `abortSignal` is triggered during streaming (`"Aborted"`).
 * @throws Error - If the Copilot response never produced a function call (`"extract() failed: No function call occurred"`).
 */
export async function extract<const T extends Parameter[]>({
  context,
  instructions,
  parameters,
  include,
  data,
  abortSignal,
  stream,
  requestType = CopilotRequestType.Task,
  forwardedParameters,
}: ExtractOptions<T>): Promise<MappedParameterTypes<T>> {
  const { messages } = context;

  const action: Action<any> = {
    name: "extract",
    description: instructions,
    parameters,
    handler: (args: any) => {},
  };

  const includeReadable = include?.readable ?? false;
  const includeMessages = include?.messages ?? false;

  let contextString = "";

  if (data) {
    contextString = (typeof data === "string" ? data : JSON.stringify(data)) + "\n\n";
  }

  if (includeReadable) {
    contextString += context.getContextString([], defaultCopilotContextCategories);
  }

  const systemMessage: Message = new TextMessage({
    content: makeSystemMessage(contextString, instructions),
    role: Role.System,
  });

  const instructionsMessage: Message = new TextMessage({
    content: makeInstructionsMessage(instructions),
    role: Role.User,
  });

  const response = context.runtimeClient.asStream(
    context.runtimeClient.generateCopilotResponse({
      data: {
        frontend: {
          actions: [
            {
              name: action.name,
              description: action.description || "",
              jsonSchema: JSON.stringify(actionParametersToJsonSchema(action.parameters || [])),
            },
          ],
          url: window.location.href,
        },

        messages: convertMessagesToGqlInput(
          includeMessages
            ? [systemMessage, instructionsMessage, ...filterAgentStateMessages(messages)]
            : [systemMessage, instructionsMessage],
        ),
        metadata: {
          requestType: requestType,
        },
        forwardedParameters: {
          ...(forwardedParameters ?? {}),
          toolChoice: "function",
          toolChoiceFunctionName: action.name,
        },
      },
      properties: context.copilotApiConfig.properties,
      signal: abortSignal,
    }),
  );

  const reader = response.getReader();

  let isInitial = true;

  let actionExecutionMessage: ActionExecutionMessage | undefined = undefined;

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    if (abortSignal?.aborted) {
      throw new Error("Aborted");
    }

    actionExecutionMessage = convertGqlOutputToMessages(
      value.generateCopilotResponse.messages,
    ).find((msg) => msg.isActionExecutionMessage()) as ActionExecutionMessage | undefined;

    if (!actionExecutionMessage) {
      continue;
    }

    stream?.({
      status: isInitial ? "initial" : "inProgress",
      args: actionExecutionMessage.arguments as Partial<MappedParameterTypes<T>>,
    });

    isInitial = false;
  }

  if (!actionExecutionMessage) {
    throw new Error("extract() failed: No function call occurred");
  }

  stream?.({
    status: "complete",
    args: actionExecutionMessage.arguments as MappedParameterTypes<T>,
  });

  return actionExecutionMessage.arguments as MappedParameterTypes<T>;
}

// We need to put this in a user message since some LLMs need
/**
 * Constructs a user-facing instruction message that presents the task and clarifies that other messages are context only.
 *
 * @param instructions - The task description to present to the assistant
 * @returns A formatted message containing the task in a fenced code block and a note that additional messages are for context only
 */
function makeInstructionsMessage(instructions: string): string {
  return `
The user has given you the following task to complete:

\`\`\`
${instructions}
\`\`\`

Any additional messages provided are for providing context only and should not be used to ask questions or engage in conversation.
`;
}

/**
 * Constructs a system prompt that instructs the assistant to act professionally, use the provided context, and invoke the `extract` function rather than asking questions.
 *
 * @param contextString - Readable context to include verbatim in the prompt
 * @param instructions - Additional instructions for the assistant (informational for callers)
 * @returns A system prompt string containing behavioral guidance, the provided context block, and a mandatory directive to call `extract` without asking questions
 */
function makeSystemMessage(contextString: string, instructions: string): string {
  return `
Please act as an efficient, competent, conscientious, and industrious professional assistant.

Help the user achieve their goals, and you do so in a way that is as efficient as possible, without unnecessary fluff, but also without sacrificing professionalism.
Always be polite and respectful, and prefer brevity over verbosity.

The user has provided you with the following context:
\`\`\`
${contextString}
\`\`\`

They have also provided you with a function called extract you MUST call to initiate actions on their behalf.

Please assist them as best you can.

This is not a conversation, so please do not ask questions. Just call the function without saying anything else.
`;
}