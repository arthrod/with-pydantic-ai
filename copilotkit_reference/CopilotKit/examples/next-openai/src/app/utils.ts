/**
 * Generate a random alphanumeric string of the specified length.
 *
 * @param length - The number of characters to generate
 * @returns A string containing randomly chosen uppercase letters, lowercase letters, and digits with the requested length
 */
export function generateRandomString(length: number) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

import { useState, useEffect, useRef } from "react";

/**
 * Creates a string state value synchronized with localStorage under the specified key.
 *
 * Reads and parses a stored JSON value from localStorage when the key changes (only in a browser environment) and sets the state if a value exists. After the first render, updates to the state are serialized to localStorage under the same key. JSON parse errors are ignored; server-side environments are skipped.
 *
 * @param defaultValue - Initial state used when there is no parsable stored value.
 * @param key - The localStorage key to read from and write to.
 * @returns A tuple `[state, setState]` where `state` is the current string value and `setState` is the state updater.
 */
export function useStateWithLocalStorage(
  defaultValue: string,
  key: string,
): [string, React.Dispatch<React.SetStateAction<string>>] {
  const [state, setState] = useState<string>(defaultValue);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storagedValue = localStorage.getItem(key);
      if (storagedValue) {
        try {
          setState(JSON.parse(storagedValue));
        } catch {}
      }
    }
  }, [key]);

  useEffect(() => {
    if (typeof window !== "undefined" && !isFirstRender.current) {
      localStorage.setItem(key, JSON.stringify(state));
    }
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  }, [key, state]);

  return [state, setState];
}

export let globalAudio: any = undefined;

/**
 * Ensure the module-level `globalAudio` is initialized and stopped at the start.
 *
 * If a `globalAudio` instance exists, pauses playback and resets its current time to 0.
 * If none exists, creates a new `HTMLAudioElement` and assigns it to `globalAudio`.
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
 * Plays the given text using the application's server TTS endpoint and waits for playback to finish.
 *
 * @param text - The text to speak; it will be URL-encoded and sent to `/api/tts`.
 * @returns Nothing — completes after audio playback ends and a 500ms post-playback delay.
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