import { useCopilotAction } from "@copilotkit/react-core";
import { SlideModel } from "../types";
import { SlidePreview } from "../components/misc/SlidePreview";

interface UpdateSlideParams {
  partialUpdateSlide: (partialSlide: Partial<SlideModel>) => void;
}

/**
 * Registers a Copilot action ("updateSlide") that updates the current slide using provided fields.
 *
 * @param partialUpdateSlide - Function invoked with a partial SlideModel to apply updates (e.g., `content`, `backgroundImageUrl`, `spokenNarration`).
 */
export default function useUpdateSlide({ partialUpdateSlide }: UpdateSlideParams) {
  useCopilotAction({
    name: "updateSlide",
    description: "Update the current slide.",
    parameters: [
      {
        name: "content",
        description: "The content of the slide. Should generally consist of a few bullet points.",
      },
      {
        name: "backgroundImageUrl",
        description:
          "The url of the background image for the slide. Use the getImageUrl tool to retrieve a URL for a topic.",
      },
      {
        name: "spokenNarration",
        description:
          "The spoken narration for the slide. This is what the user will hear when the slide is shown.",
      },
    ],
    handler: async ({ content, backgroundImageUrl, spokenNarration }) => {
      partialUpdateSlide({
        content,
        backgroundImageUrl,
        spokenNarration,
      });
    },
    render: (props) => {
      return (
        <SlidePreview
          {...props.args}
          done={props.status === "complete"}
          inProgressLabel="Updating slide..."
          doneLabel="Slide updated."
        />
      );
    },
  });
}