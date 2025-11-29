interface SlidePreviewProps {
  inProgressLabel: string;
  doneLabel: string;
  title?: string;
  content?: string;
  spokenNarration?: string;
  done?: boolean;
}

/**
 * Render a stylized slide preview showing a title (based on progress), content, and optional spoken narration.
 *
 * @param content - The main slide content to display; rendered verbatim with preserved whitespace.
 * @param spokenNarration - Optional quoted narration shown beneath the content when provided.
 * @param done - When `true`, the title uses `doneLabel`; otherwise `inProgressLabel` is used.
 * @param doneLabel - Title text displayed when the slide is marked done.
 * @param inProgressLabel - Title text displayed when the slide is not done.
 * @returns A JSX element representing the slide preview card.
 */
export function SlidePreview({
  content,
  spokenNarration,
  done,
  doneLabel,
  inProgressLabel,
}: SlidePreviewProps) {
  return (
    <div className="">
      <div className=" w-full relative max-w-xs">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
        <div className="relative shadow-xl bg-gray-900 border border-gray-800  px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-end items-start">
          <h1 className="font-bold text-xl text-white mb-4 relative z-50">
            {done ? doneLabel : inProgressLabel}
          </h1>
          <p className="font-normal text-base text-slate-500 mb-4 relative z-50 whitespace-pre">
            {content}
          </p>
          {spokenNarration && (
            <p className="font-normal text-sm text-slate-500 mb-4 relative z-50">
              &quot;{spokenNarration}&quot;
            </p>
          )}
        </div>
      </div>
    </div>
  );
}