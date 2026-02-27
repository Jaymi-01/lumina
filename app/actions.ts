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

async function fetchOpenLibraryCover(title: string, author: string) {
  try {
    const query = encodeURIComponent(`title:${title} author:${author}`);
    const res = await fetch(`https://openlibrary.org/search.json?q=${query}&limit=1`);
    if (!res.ok) return null;
    const data = await res.json();
    const work = data.docs?.[0];
    if (work && work.cover_i) return `https://covers.openlibrary.org/b/id/${work.cover_i}-L.jpg`;
    if (work && work.isbn && work.isbn.length > 0) return `https://covers.openlibrary.org/b/isbn/${work.isbn[0]}-L.jpg`;
    return null;
  } catch (e) {
    return null;
  }
}

export async function getRecommendations(
  mode: "vibe" | "blueprint" | "restricted",
  vibeText?: string,
  genres?: string[],
  pacing?: string,
  tone?: string,
  era?: string
): Promise<RecommendationsResponse | null> {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      console.error("Lumina: GOOGLE_API_KEY is missing");
      return null;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let context = "";
    if (mode === "vibe") {
      context = `The user's vibe: "${vibeText}"`;
    } else if (mode === "blueprint") {
      context = `Preferences - Genres: ${genres?.join(", ")}, Pacing: ${pacing}, Tone: ${tone}, Era: ${era}`;
    } else if (mode === "restricted") {
      context = `The user is entering The Restricted Section. Recommend 5 obscure gems, cult classics, or highly-rated but lesser-known real-world books that are surprising and unique.`;
    }

    const prompt = `
      Act as a world-class Digital Librarian. 
      ${context}
      
      CRITICAL: Only recommend real-world books with verified titles and authors.
      
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
        let finalThumbnail = "";
        let finalDescription = "No archival summary available.";
        let finalGenre = rec.genre || "Literature";
        let googleId = "";

        try {
          const query = encodeURIComponent(`intitle:${rec.title} inauthor:${rec.author}`);
          let res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1&key=${process.env.GOOGLE_API_KEY}`);
          if (!res.ok) res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`);
          
          const gbData = await res.json();
          const item = gbData.items?.[0];

          if (item) {
            const vol = item.volumeInfo;
            googleId = item.id;
            finalGenre = vol.categories?.[0] || finalGenre;
            finalDescription = vol.description || finalDescription;
            let googleThumb = vol.imageLinks?.extraLarge || vol.imageLinks?.large || vol.imageLinks?.medium || vol.imageLinks?.thumbnail || vol.imageLinks?.smallThumbnail;
            if (googleThumb) finalThumbnail = googleThumb.replace("http://", "https://");
          }

          if (!finalThumbnail) {
            const olCover = await fetchOpenLibraryCover(rec.title, rec.author);
            if (olCover) finalThumbnail = olCover;
          }
        } catch (e) {
          const olCover = await fetchOpenLibraryCover(rec.title, rec.author);
          if (olCover) finalThumbnail = olCover;
        }

        return {
          ...rec,
          googleBooksId: googleId,
          thumbnail: finalThumbnail,
          genre: finalGenre,
          description: finalDescription,
        };
      })
    );

    return { recommendations: enrichedRecs };
  } catch (error) {
    console.error("Lumina Action Error:", error);
    return null;
  }
}
