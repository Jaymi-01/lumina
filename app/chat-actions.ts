"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function askLibrarian(
  question: string, 
  history: { role: "user" | "librarian"; content: string }[],
  contextBooks: string[]
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const chat = model.startChat({
      history: history.map(h => ({
        role: h.role === "librarian" ? "model" : "user",
        parts: [{ text: h.content }],
      })),
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const systemPrompt = `You are Lumina, a world-class Digital Librarian. 
    The current recommended books are: ${contextBooks.join(", ")}. 
    Answer the user's questions about these books or their reading journey with wisdom, magic, and helpfulness. 
    Keep responses concise and elegant.`;

    const result = await chat.sendMessage(`${systemPrompt}

User Question: ${question}`);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Chat Action Error:", error);
    return "I apologize, the magical link to my archives has flickered. Please try again.";
  }
}
