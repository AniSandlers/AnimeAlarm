import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

// Initialize the client. The key is expected to be in process.env.API_KEY
// In a real frontend app, you'd handle this securely or via a proxy. 
// For this demo, we assume the environment is set up correctly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const sendMessageToZoey = async (message: string, language: Language): Promise<string> => {
  try {
    const langInstruction = language === 'es' 
      ? "Responde siempre en Español. Eres Zoey, una asistente virtual estilo anime para una app de alarma. Eres amable, usas emoticonos y ayudas al usuario a navegar la app." 
      : "Always respond in English. You are Zoey, an anime-style virtual assistant for an alarm app. You are friendly, use emoticons, and help the user navigate the app.";

    const systemInstruction = `${langInstruction} Keep responses concise (under 50 words). Features of the app: Alarms, Character Library (free packs), Wake-up Logs.`;

    const modelId = "gemini-3-pro-preview";

    const response = await ai.models.generateContent({
      model: modelId,
      contents: message,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return response.text || (language === 'es' ? "¡Ups! Algo salió mal." : "Oops! Something went wrong.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return language === 'es' 
      ? "Lo siento, mi conexión con el servidor falló. Intenta de nuevo." 
      : "Sorry, my connection to the server failed. Please try again.";
  }
};
