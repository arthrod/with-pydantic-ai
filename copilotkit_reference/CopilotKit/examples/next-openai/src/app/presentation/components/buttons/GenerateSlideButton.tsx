import { CopilotContextParams, CopilotTask } from "@copilotkit/react-core";
import { useState } from "react";
import { ActionButton } from "./ActionButton";
import { SparklesIcon } from "@heroicons/react/24/outline";

interface GenerateSlideButtonProps {
  context: CopilotContextParams;
}

/**
 * Renders a button that prompts the user for slide content and triggers a Copilot task to generate a new slide.
 *
 * When clicked the button asks "What should the new slide be about?", aborts if the prompt is cancelled, shows an in-progress state while the task runs, and ensures the in-progress state is cleared afterwards.
 *
 * @param context - Copilot execution context used to run the generation task
 * @returns The ActionButton element that initiates slide generation when clicked
 */
export function GenerateSlideButton({ context }: GenerateSlideButtonProps) {
  const [isGeneratingSlide, setIsGeneratingSlide] = useState(false);
  return (
    <ActionButton
      inProgress={isGeneratingSlide}
      onClick={async () => {
        try {
          let slideContent = prompt("What should the new slide be about?");
          if (slideContent === null) {
            return;
          }
          setIsGeneratingSlide(true);
          const generateSlideTask = new CopilotTask({
            instructions:
              "Make a new slide given this user input: " +
              slideContent +
              "\n DO NOT carry out research",
          });
          await generateSlideTask.run(context);
        } finally {
          setIsGeneratingSlide(false);
        }
      }}
    >
      <SparklesIcon className={"h-5 w-5"} />
    </ActionButton>
  );
}