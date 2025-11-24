"use client";
import useUpdateSlide from "../../actions/useUpdateSlide";
import { SlideModel } from "../../types";

export interface SlideProps {
  slide: SlideModel;
  partialUpdateSlide: (partialSlide: Partial<SlideModel>) => void;
}

export const Slide = (props: SlideProps) => {
  const backgroundImage = `url("${props.slide.backgroundImageUrl}")`;

  /**
   * This action allows the Copilot to update the current slide.
   */
  useUpdateSlide({ partialUpdateSlide: props.partialUpdateSlide });

  return (
    <div className="w-full h-full flex flex-row bg-white">
      <div className="flex-grow h-full flex flex-col" style={{ flex: "2" }}>
        <SlideContent
          content={props.slide.content}
          onChange={(newContent) => {
            props.partialUpdateSlide({ content: newContent });
          }}
        />
        <SlideSpeakerNotes
          spokenNarration={props.slide.spokenNarration}
          onChange={(newSpokenNarration) => {
            props.partialUpdateSlide({ spokenNarration: newSpokenNarration });
          }}
        />
      </div>
      <SlideImage backgroundImage={backgroundImage} />
    </div>
  );
};

/**
 * Renders a flexible full-height pane that displays the provided CSS background image.
 *
 * @param backgroundImage - The CSS `background-image` value to apply (for example `url(...)` or any valid CSS image value).
 * @returns A div that fills available space and shows the background image with cover sizing and centered positioning.
 */
function SlideImage({ backgroundImage }: { backgroundImage: string }) {
  return (
    <div
      className="flex-grow h-full bg-slate-200"
      style={{
        flex: "1",
        backgroundImage,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
}

interface SpeakerNotesProps {
  spokenNarration: string;
  onChange: (newSpokenNarration: string) => void;
}

/**
 * Renders an editable pane for a slide's speaker notes.
 *
 * @param spokenNarration - The current spoken narration text shown in the textarea.
 * @param onChange - Callback invoked with the updated narration string when the user edits the textarea.
 * @returns The speaker notes pane as a JSX element.
 */
function SlideSpeakerNotes({ spokenNarration, onChange }: SpeakerNotesProps) {
  return (
    <div className="bg-gray-200 relative h-20 flex flex-col">
      <textarea
        className="w-full h-full bg-transparent p-2 text-base"
        style={{
          border: "none",
          outline: "none",
          lineHeight: "1.5",
          resize: "none",
        }}
        placeholder="Speaker notes..."
        value={spokenNarration}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    </div>
  );
}

interface SlideContentProps {
  content: string;
  onChange: (newContent: string) => void;
}

/**
 * Renders an editable textarea for the slide's main content and reports edits.
 *
 * @param content - The current slide content displayed in the textarea.
 * @param onChange - Called with the updated content string when the user edits the textarea.
 * @returns The textarea element used to edit the slide content.
 */
function SlideContent({ content, onChange }: SlideContentProps) {
  return (
    <textarea
      className="flex-1 w-full text-gray-800 p-4 px-10 font-bold flex items-center line-clamp-6"
      style={{
        border: "none",
        outline: "none",
        resize: "none",
        fontSize: "2vw",
      }}
      value={content}
      placeholder="Slide content..."
      onChange={(e) => {
        onChange(e.target.value);
      }}
    />
  );
}