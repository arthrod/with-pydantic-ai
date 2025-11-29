import { SlideModel } from "../../types";
import { ActionButton } from "./ActionButton";
import { TrashIcon } from "@heroicons/react/24/outline";

interface DeleteSlideButtonProps {
  currentSlideIndex: number;
  setCurrentSlideIndex: (fn: (i: number) => number) => void;
  slides: SlideModel[];
  setSlides: (fn: (slides: SlideModel[]) => SlideModel[]) => void;
}

/**
 * Render a delete button for removing the currently selected slide.
 *
 * @param currentSlideIndex - Index of the slide currently selected.
 * @param setCurrentSlideIndex - Setter for the current slide index; the component resets the index to 0 after deletion.
 * @param slides - Array of all slides.
 * @param setSlides - Setter for the slides array; the component removes the slide at `currentSlideIndex` when activated.
 * @returns A React element that renders a button which deletes the current slide when clicked (disabled when there's only one slide).
 */
export function DeleteSlideButton({
  currentSlideIndex,
  setCurrentSlideIndex,
  slides,
  setSlides,
}: DeleteSlideButtonProps) {
  return (
    <ActionButton
      disabled={slides.length == 1}
      onClick={() => {
        // delete the current slide
        setSlides((slides) => [
          ...slides.slice(0, currentSlideIndex),
          ...slides.slice(currentSlideIndex + 1),
        ]);
        setCurrentSlideIndex((i) => 0);
      }}
    >
      <TrashIcon className="h-5 w-5" />
    </ActionButton>
  );
}