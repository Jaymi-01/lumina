import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type BookRecommendation } from "@/app/actions";

interface ChatMessage {
  role: "user" | "librarian";
  content: string;
}

interface LuminaState {
  favorites: BookRecommendation[];
  addFavorite: (book: BookRecommendation) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  
  chatHistory: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;
  
  ambientSound: string | null; // 'rain', 'fire', 'theme', null
  setAmbientSound: (sound: string | null) => void;
}

export const useLuminaStore = create<LuminaState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (book) => set((state) => ({ 
        favorites: [...state.favorites, book] 
      })),
      removeFavorite: (id) => set((state) => ({ 
        favorites: state.favorites.filter((b) => b.googleBooksId !== id) 
      })),
      isFavorite: (id) => get().favorites.some((b) => b.googleBooksId === id),
      
      chatHistory: [],
      addChatMessage: (msg) => set((state) => ({ 
        chatHistory: [...state.chatHistory, msg] 
      })),
      clearChat: () => set({ chatHistory: [] }),
      
      ambientSound: null,
      setAmbientSound: (sound) => set({ ambientSound: sound }),
    }),
    {
      name: "lumina-storage",
      partialize: (state) => ({ favorites: state.favorites }), // Only persist favorites
    }
  )
);
