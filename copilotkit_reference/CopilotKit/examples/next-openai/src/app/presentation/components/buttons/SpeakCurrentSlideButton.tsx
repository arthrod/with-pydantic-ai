import { useState } from "react";
import { ActionButton } from "./ActionButton";
import { SpeakerWaveIcon } from "@heroicons/react/24/outline";
import { resetGlobalAudio, speak } from "../../utils/globalAudio";

interface SpeakCurrentSlideButtonProps {
  spokenNarration: string;
}

/**
 * Renders a button that speaks the provided slide narration when activated.
 *
 * The button displays a speaker icon and shows an in-progress state while text-to-speech is running.
 * It resets any global audio before starting speech and ensures the in-progress indicator is cleared after completion.
 *
 * @param spokenNarration - The narration text to speak for the current slide
 * @returns The rendered button element that triggers speaking the narration when clicked
 */
export function SpeakCurrentSlideButton({ spokenNarration }: SpeakCurrentSlideButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  return (
    <ActionButton inProgress={isSpeaking}>
      <SpeakerWaveIcon
        className="h-5 w-5"
        onClick={async () => {
          resetGlobalAudio();
          try {
            setIsSpeaking(true);
            await speak(spokenNarration);
          } finally {
            setIsSpeaking(false);
          }
        }}
      />
    </ActionButton>
  );
}