import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function editImage(
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<string | null> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
}

export async function chatWithAssistant(
  history: { role: "user" | "model"; parts: { text: string }[] }[],
  message: string
) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [
        ...history,
        { role: "user", parts: [{ text: message }] },
      ],
      config: {
        systemInstruction:
          "You are a director's assistant and an expert in Charlie Chaplin and silent films. You help users modernize these films and brainstorm ideas to enthrall today's mass-market audience. You are creative, knowledgeable, and enthusiastic about blending classic cinema with modern AI technology.",
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error chatting with assistant:", error);
    throw error;
  }
}
