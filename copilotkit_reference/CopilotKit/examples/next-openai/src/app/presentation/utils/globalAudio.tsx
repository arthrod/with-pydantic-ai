"use client";

export let globalAudio: any = undefined;

/**
 * Ensure the module-level audio instance exists and reset its playback state.
 *
 * If a global audio instance already exists, pauses playback and sets its current time to 0.
 * If none exists, creates a new HTMLAudioElement and assigns it to `globalAudio`.
 */
export function resetGlobalAudio() {
  if (globalAudio) {
    globalAudio.pause();
    globalAudio.currentTime = 0;
  } else {
    globalAudio = new Audio();
  }
}

/**
 * Play text using the application's text-to-speech endpoint and wait for playback to finish.
 *
 * @param text - Text to synthesize and play.
 * @returns Resolves when audio playback and a subsequent 500ms post-play delay have completed.
 */
export async function speak(text: string) {
  const encodedText = encodeURIComponent(text);
  const url = `/api/tts?text=${encodedText}`;
  globalAudio.src = url;
  globalAudio.play();
  await new Promise<void>((resolve) => {
    globalAudio.onended = function () {
      resolve();
    };
  });
  await new Promise((resolve) => setTimeout(resolve, 500));
}