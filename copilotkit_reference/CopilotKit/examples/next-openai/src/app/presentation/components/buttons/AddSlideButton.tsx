import { SlideModel } from "../../types";
import { ActionButton } from "./ActionButton";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

interface AddSlideButtonProps {
  currentSlideIndex: number;
  setCurrentSlideIndex: (fn: (i: number) => number) => void;
  setSlides: (fn: (slides: SlideModel[]) => SlideModel[]) => void;
}

/**
 * Render a button that inserts a new empty slide immediately after the current slide and advances the current slide index.
 *
 * @param currentSlideIndex - The zero-based index of the currently active slide.
 * @param setCurrentSlideIndex - Updater function that receives an index updater callback to change the current slide index.
 * @param setSlides - Updater function that receives a slides-array updater callback and replaces the slides array.
 * @returns The ActionButton React element that, when clicked, inserts a new `SlideModel` after `currentSlideIndex` and increments the current index by 1.
 */
export function AddSlideButton({
  currentSlideIndex,
  setCurrentSlideIndex,
  setSlides,
}: AddSlideButtonProps) {
  return (
    <ActionButton
      onClick={() => {
        const newSlide: SlideModel = {
          content: "",
          backgroundImageUrl: "",
          backgroundImageDescription: "random",
          spokenNarration: "",
        };
        setSlides((slides) => [
          ...slides.slice(0, currentSlideIndex + 1),
          newSlide,
          ...slides.slice(currentSlideIndex + 1),
        ]);
        setCurrentSlideIndex((i) => i + 1);
      }}
    >
      <PlusCircleIcon className="h-5 w-5" />
    </ActionButton>
  );
}