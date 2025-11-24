import { OpenAI } from "openai";

export const runtime = "edge";

const openai = new OpenAI();

/**
 * Handle GET requests that generate speech from the `text` query parameter using OpenAI's TTS model.
 *
 * @param req - HTTP request whose URL must include a `text` query parameter containing the text to synthesize
 * @returns An HTTP `Response` containing the generated audio from the OpenAI TTS API, or a 400 response with the message "Text parameter is missing" when the `text` parameter is absent
 */
export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const text = url.searchParams.get("text"); // 'text' is the query parameter name

  if (!text) {
    return new Response("Text parameter is missing", { status: 400 });
  }

  const response = await openai.audio.speech.create({
    voice: "alloy",
    input: text,
    model: "tts-1",
  });

  return response;
}