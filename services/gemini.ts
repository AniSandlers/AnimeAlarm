import { GoogleGenerativeAI } from '@google/generative-ai';


// Initialize the API
// Note: In Vite, env vars are exposed via import.meta.env
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ''; // Will fail if not set, handled in UI

// We can use the fetch API directly if the SDK is too heavy or has issues in this environment, 
// but since the user has @google/genai installed in package.json (step 8), we should try to use it? 
// Wait, package.json has "@google/genai": "^1.39.0". 
// Correction: The new SDK usage.

const genAI = new GoogleGenerativeAI(apiKey);

export const chatWithZoey = async (message: string): Promise<string> => {
    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
        return "Error: API Key missing. Please check .env.local";
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        // Debug logging
        console.log("Using API Key starting with:", apiKey ? apiKey.substring(0, 4) + "..." : "UNDEFINED");


        const systemPrompt = `You are Zoey, a cheerful, energetic, and helpful anime-style assistant for an alarm app called "Anime Alarm". 
    Your personality is "Genki" (full of energy). You call the user "Senpai". 
    Keep your responses concise (under 50 words usually), fun, and motivating. 
    Use emojis occasionally. 
    If asked about the app, you can help with alarms, library, or settings.`;

        // Simple one-shot chat for now, or maintain history?
        // For simplicity in this iteration, we send the prompt + message.
        const result = await model.generateContent(`${systemPrompt}\n\nUser: ${message}\nZoey:`);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini FULL Error:", error);
        return `Oops! I got a bit dizzy... (${error instanceof Error ? error.message : String(error)})`;
    }
};
