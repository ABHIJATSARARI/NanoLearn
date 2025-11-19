import { GoogleGenAI, Type } from "@google/genai";
import { MicroLesson } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

type InputPayload = 
  | { type: 'text'; content: string }
  | { type: 'file'; mimeType: string; data: string };

const generateContentWithRetry = async (params: any, retries = 3, baseDelay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await ai.models.generateContent(params);
    } catch (error: any) {
      const isOverloaded = 
        error?.status === 503 || 
        error?.code === 503 || 
        (error?.message && error.message.includes('overloaded'));

      if (isOverloaded && i < retries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        console.warn(`Gemini model overloaded. Retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
};

export const generateMicroLesson = async (
  input: InputPayload,
  difficulty: string = "Intermediate"
): Promise<MicroLesson | null> => {
  try {
    const promptText = `
      Act as an expert micro-learning tutor called NanoLearn.
      Analyze the provided content and create a "Micro-Lesson".
      The target difficulty is ${difficulty}.
      
      Requirements:
      1. Topic: A short, punchy title.
      2. Emoji: A single relevant emoji.
      3. Summary: A one-sentence high-level concept summary.
      4. Explainer: A roughly 100-150 word explanation.
      5. KeyPoints: 3 bullet points.
      6. Quiz: 3 multiple choice questions.
    `;

    let contents;

    if (input.type === 'text') {
      contents = [
        { text: promptText },
        { text: `Input Text: "${input.content.substring(0, 20000)}"` }
      ];
    } else {
      contents = [
        { text: promptText },
        {
          inlineData: {
            mimeType: input.mimeType,
            data: input.data
          }
        }
      ];
    }

    const response = await generateContentWithRetry({
      model: "gemini-2.5-flash",
      contents: { parts: contents },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            emoji: { type: Type.STRING },
            summary: { type: Type.STRING },
            explainer: { type: Type.STRING },
            keyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            difficultyLevel: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Advanced"] },
            quiz: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctIndex: { type: Type.INTEGER, description: "Zero-based index of the correct answer" },
                  explanation: { type: Type.STRING, description: "Why this is the correct answer" },
                },
                required: ["id", "question", "options", "correctIndex", "explanation"],
              },
            },
          },
          required: ["topic", "emoji", "summary", "explainer", "keyPoints", "quiz", "difficultyLevel"],
        },
      },
    });

    if (response.text) {
      const lesson = JSON.parse(response.text) as MicroLesson;
      // Add client-side metadata for persistence
      lesson.id = crypto.randomUUID();
      lesson.timestamp = Date.now();
      return lesson;
    }
    return null;

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};