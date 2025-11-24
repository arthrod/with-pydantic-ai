import { OpenAI } from "openai";

export const runtime = "edge";

const openai = new OpenAI();

/**
 * Handle POST requests that transcribe an uploaded audio file using the Whisper model.
 *
 * Expects a multipart/form-data request containing a file field named "file". On success,
 * responds with a 200 JSON response containing the transcription result. If the file is
 * missing, responds with 400 and message "File not provided". On unexpected errors,
 * responds with 500 and a JSON object with an `error` message.
 *
 * @param req - The incoming Request; should be multipart/form-data with a `file` field
 * @returns A Response containing the transcription JSON on success, or an error payload and appropriate status code on failure
 */
export async function POST(req: Request): Promise<Response> {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response("File not provided", { status: 400 });
    }

    const transcription = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
    });

    return new Response(JSON.stringify(transcription), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}