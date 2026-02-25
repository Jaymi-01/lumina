"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export interface BookRecommendation {
  title: string;
  author: string;
  reasoning: string;
  vibeScore: number;
  googleBooksId?: string;
  thumbnail?: string;
  genre?: string;
  description?: string;
}

interface RecommendationsResponse {
  recommendations: BookRecommendation[];
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function getRecommendations(
  mode: "vibe" | "blueprint",
  vibeText?: string,
  genres?: string[],
  pacing?: string,
  tone?: string,
  era?: string
): Promise<RecommendationsResponse | null> {
  try {
    if (!process.env.GOOGLE_API_KEY) return null;

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    let context = "";
    if (mode === "vibe") {
      context = `The user's vibe: "${vibeText}"`;
    } else {
      context = `Preferences - Genres: ${genres?.join(", ")}, Pacing: ${pacing}, Tone: ${tone}, Era/Time Period: ${era}`;
    }

    const prompt = `
      Act as a world-class Digital Librarian. 
      ${context}

      CRITICAL INSTRUCTION: If an Era is specified (e.g., "Modern (Last 2 years)"), you MUST only recommend books published within that timeframe.
      
      Tasks:
      1. Recommend 5 real books.
      2. One-sentence "reasoning".
      3. "Vibe Score" (0-100).
      
      Return ONLY a JSON object:
      {
        "recommendations": [
          { "title": "Title", "author": "Author", "reasoning": "...", "vibeScore": 95 }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const text = (await result.response).text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    
    const data = JSON.parse(jsonMatch[0]) as RecommendationsResponse;

    const enrichedRecs = await Promise.all(
      data.recommendations.map(async (rec) => {
        try {
          const query = encodeURIComponent(`intitle:${rec.title} inauthor:${rec.author}`);
          let res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1&key=${process.env.GOOGLE_API_KEY}`);
          if (!res.ok) res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`);
          
          const gbData = await res.json();
          const item = gbData.items?.[0];

          if (item) {
            const vol = item.volumeInfo;
            let thumbnailUrl = vol.imageLinks?.extraLarge || vol.imageLinks?.large || vol.imageLinks?.medium || vol.imageLinks?.thumbnail || vol.imageLinks?.smallThumbnail;
            if (thumbnailUrl) thumbnailUrl = thumbnailUrl.replace("http://", "https://");

            return {
              ...rec,
              googleBooksId: item.id,
              thumbnail: thumbnailUrl,
              genre: vol.categories?.[0] || (mode === "blueprint" ? genres?.[0] : "Literature"),
              description: vol.description || "No archival summary available.",
            };
          }
          return rec;
        } catch (e) {
          return rec;
        }
      })
    );

    return { recommendations: enrichedRecs };
  } catch (error) {
    console.error("Lumina Action Error:", error);
    return null;
  }
}
