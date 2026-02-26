import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type BookRecommendation } from "@/app/actions";

export interface SummoningHistory {
  id: string;
  timestamp: number;
  mode: "vibe" | "blueprint";
  vibeText?: string;
  preferences?: {
    genres: string[];
    pacing: string;
    tone: string;
    era: string;
  };
}

interface LuminaState {
  favorites: BookRecommendation[];
  addFavorite: (book: BookRecommendation) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  
  history: SummoningHistory[];
  addHistory: (item: Omit<SummoningHistory, "id" | "timestamp">) => void;
  clearHistory: () => void;
  
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
      
      history: [],
      addHistory: (item) => set((state) => {
        const newItem = {
          ...item,
          id: Math.random().toString(36).substring(7),
          timestamp: Date.now()
        };
        // Keep only last 10 entries
        const newHistory = [newItem, ...state.history].slice(0, 10);
        return { history: newHistory };
      }),
      clearHistory: () => set({ history: [] }),
      
      ambientSound: null,
      setAmbientSound: (sound) => set({ ambientSound: sound }),
    }),
    {
      name: "lumina-storage",
      partialize: (state) => ({ favorites: state.favorites, history: state.history }),
    }
  )
);
