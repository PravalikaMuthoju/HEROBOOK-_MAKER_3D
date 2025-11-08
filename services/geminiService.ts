
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { CustomizationOptions } from '../types';

let ai: GoogleGenAI;
try {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
} catch (error) {
  console.error("Failed to initialize GoogleGenAI. API_KEY might be missing.", error);
}

export const fileToBase64 = (file: File): Promise<{mimeType: string, data: string}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const [header, data] = result.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || 'application/octet-stream';
      resolve({ mimeType, data });
    };
    reader.onerror = (error) => reject(error);
  });
};

export async function generateStoryCaptions(
  options: CustomizationOptions
): Promise<string[]> {
  if (!ai) {
    console.error("Gemini AI client not initialized.");
    return [
      "The hero in a red costume soars through the sky!",
      "With a power stance, the hero faces the challenge ahead.",
      "Ready for action, our hero prepares for an epic adventure."
    ];
  }

  const { style, color, pose } = options;

  const prompt = `
    Generate exactly 3 short, exciting, one-sentence superhero story captions for a child hero.
    The hero's story should be told in a ${style} animation style.
    The hero is wearing a ${color} costume.
    The hero's current pose is a "${pose}" pose.
    The story should be age-appropriate for a 5-10 year old.
    The output must be a JSON array of 3 strings. Do not include any other text or markdown formatting.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
            },
        }
    });
    
    const text = response.text.trim();
    const captions = JSON.parse(text);

    if (Array.isArray(captions) && captions.length >= 3 && captions.every(c => typeof c === 'string')) {
      return captions.slice(0, 3);
    }
    
    throw new Error("Invalid format received from Gemini.");

  } catch (error) {
    console.error("Error generating story captions with Gemini:", error);
    // Return fallback captions on error
    return [
      `Our ${color} hero strikes a mighty ${pose} pose, ready for anything!`,
      `In a world drawn in the style of ${style}, a new champion rises.`,
      `The adventure is just beginning for the bravest hero of all!`,
    ];
  }
}

export async function generateHeroImage(
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string> { // returns a base64 data URL
  if (!ai) {
    throw new Error("Gemini AI client not initialized.");
  }
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes = part.inlineData.data;
        const imageMimeType = part.inlineData.mimeType;
        return `data:${imageMimeType};base64,${base64ImageBytes}`;
      }
    }
    throw new Error("No image data found in response.");

  } catch(error) {
    console.error("Error generating hero image with Gemini:", error);
    throw error;
  }
}
