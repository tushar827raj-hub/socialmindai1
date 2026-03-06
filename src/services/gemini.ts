import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface GeneratedPost {
  content: string;
  platforms: string[];
  suggestedTime: string;
}

export async function generateSocialContent(prompt: string, platforms: string[]): Promise<GeneratedPost> {
  const model = "gemini-3.1-pro-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: `Generate a social media post for the following platforms: ${platforms.join(', ')}. 
    Context/Prompt: ${prompt}. 
    Return a JSON object with 'content', 'platforms', and 'suggestedTime' (ISO 8601).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          content: { type: Type.STRING },
          platforms: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestedTime: { type: Type.STRING }
        },
        required: ["content", "platforms", "suggestedTime"]
      }
    }
  });

  return JSON.parse(response.text);
}

export interface DailyPlan {
  posts: GeneratedPost[];
}

export async function generateDailyPlan(theme: string, platformCounts: Record<string, number>): Promise<DailyPlan> {
  const model = "gemini-3.1-pro-preview";
  
  const platformList = Object.entries(platformCounts)
    .filter(([_, count]) => count > 0)
    .map(([platform, count]) => `${platform}: ${count} posts`)
    .join(', ');

  const response = await ai.models.generateContent({
    model,
    contents: `Generate a daily social media plan based on the theme: "${theme}". 
    The plan should include the following number of posts per platform: ${platformList}.
    Ensure each post is unique and optimized for its platform.
    Return a JSON object with a 'posts' array, where each item has 'content', 'platforms' (array), and 'suggestedTime' (ISO 8601 string for today/tomorrow).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          posts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                content: { type: Type.STRING },
                platforms: { type: Type.ARRAY, items: { type: Type.STRING } },
                suggestedTime: { type: Type.STRING }
              },
              required: ["content", "platforms", "suggestedTime"]
            }
          }
        },
        required: ["posts"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function getAgentAdvice(history: any[]): Promise<string> {
  const model = "gemini-3-flash-preview";
  const response = await ai.models.generateContent({
    model,
    contents: `Based on the following social media history, give some strategic advice for the next posts: ${JSON.stringify(history)}`,
  });
  return response.text || "No advice at this time.";
}
