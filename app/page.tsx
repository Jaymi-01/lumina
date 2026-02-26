"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VibeInput } from "@/components/VibeInput";
import { PreferenceSelector } from "@/components/PreferenceSelector";
import { BookCard } from "@/components/BookCard";
import { PageFlipLoader } from "@/components/PageFlipLoader";
import { ArchivalController } from "@/components/ArchivalController";
import { ElderWand } from "@/components/ElderWand";
import { getRecommendations, type BookRecommendation } from "./actions";
import { BookOpenText, Sparkle, Wind, ListDashes, ArrowRight, LockKey } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useLuminaStore, type SummoningHistory } from "@/lib/store";

export default function Home() {
  const [mode, setMode] = useState<"vibe" | "blueprint">("vibe");
  const [results, setResults] = useState<BookRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { addHistory } = useLuminaStore();

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedPacing, setSelectedPacing] = useState("");
  const [selectedTone, setSelectedTone] = useState("");
  const [selectedEra, setSelectedEra] = useState("");

  const handleSearch = async (
    vibeText?: string, 
    isRestricted = false, 
    overridePrefs?: SummoningHistory["preferences"]
  ) => {
    setIsLoading(true);
    setResults([]);
    
    const searchMode = isRestricted ? "restricted" : mode;
    const genres = overridePrefs?.genres || selectedGenres;
    const pacing = overridePrefs?.pacing || selectedPacing;
    const tone = overridePrefs?.tone || selectedTone;
    const era = overridePrefs?.era || selectedEra;

    try {
      const response = await getRecommendations(searchMode, vibeText, genres, pacing, tone, era);
      if (response) {
        setResults(response.recommendations);
        toast.success(isRestricted ? "The Restricted Section has opened..." : "Volumes summoned!");
        
        if (!isRestricted && !overridePrefs) {
          addHistory({
            mode,
            vibeText,
            preferences: mode === "blueprint" ? { genres, pacing, tone, era } : undefined
          });
        }
      }
    } catch (error) {
      toast.error("The magic archives flickered. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReSummon = (history: SummoningHistory) => {
    setMode(history.mode);
    if (history.mode === "vibe") {
      handleSearch(history.vibeText);
    } else if (history.preferences) {
      setSelectedGenres(history.preferences.genres);
      setSelectedPacing(history.preferences.pacing);
      setSelectedTone(history.preferences.tone);
      setSelectedEra(history.preferences.era);
      handleSearch(undefined, false, history.preferences);
    }
  };

  const isBlueprintValid = selectedGenres.length > 0 && selectedPacing && selectedTone && selectedEra;

  return (
    <main className="min-h-screen relative overflow-x-hidden pb-32 bg-[#F5F2ED] selection:bg-[#4A5D4E] selection:text-white">
      <ElderWand />
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />

      {/* Unified Rolling Hub (History, Study, Atmosphere) */}
      <ArchivalController onReSummon={handleReSummon} />

      <div className="container mx-auto px-6 pt-16 pb-12 relative z-10">
        <header className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/30 backdrop-blur-md border border-white/50 mb-8 shadow-sm">
            <BookOpenText size={24} weight="fill" className="text-[#1A1A1A]/60" />
          </div>
          <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tighter text-[#1A1A1A] mb-6">Lumina</h1>
          <p className="text-lg md:text-xl text-[#1A1A1A]/40 max-w-lg mx-auto italic font-medium">The Digital Librarian for discovery.</p>
        </header>

        <div className="max-w-md mx-auto mb-16 relative z-20 flex flex-col items-center gap-6">
          <div className="bg-white/20 backdrop-blur-xl p-1.5 rounded-2xl border border-white/40 flex shadow-inner w-full">
            <button onClick={() => setMode("vibe")} className={cn("flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all", mode === "vibe" ? "bg-white text-[#1A1A1A] shadow-lg" : "text-[#1A1A1A]/40")}>
              <Wind size={18} weight="fill" /> The Vibe
            </button>
            <button onClick={() => setMode("blueprint")} className={cn("flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all", mode === "blueprint" ? "bg-white text-[#1A1A1A] shadow-lg" : "text-[#1A1A1A]/40")}>
              <ListDashes size={18} weight="fill" /> The Blueprint
            </button>
          </div>

          <button onClick={() => handleSearch(undefined, true)} disabled={isLoading} className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#1A1A1A]/30 hover:text-[#8C6A5E] transition-all">
            <LockKey size={16} weight="fill" className="group-hover:rotate-12 transition-transform" /> Enter Restricted Section
          </button>
        </div>

        <section className="max-w-5xl mx-auto mb-24 relative z-20">
          <AnimatePresence mode="wait">
            {mode === "vibe" ? (
              <motion.div key="vibe" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <VibeInput onSearch={(text) => handleSearch(text)} isLoading={isLoading} />
              </motion.div>
            ) : (
              <motion.div key="blueprint" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center">
                <PreferenceSelector 
                  selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres}
                  selectedPacing={selectedPacing} setSelectedPacing={setSelectedPacing}
                  selectedTone={selectedTone} setSelectedTone={setSelectedTone}
                  selectedEra={selectedEra} setSelectedEra={setSelectedEra}
                />
                <button onClick={() => handleSearch()} disabled={isLoading || !isBlueprintValid} className="mt-16 group flex items-center gap-4 bg-[#1A1A1A] text-white px-10 py-5 rounded-full text-lg font-bold shadow-2xl transition-all hover:-translate-y-1 disabled:opacity-20">
                  <span>{isLoading ? "Summoning..." : "Accio"}</span>
                  <ArrowRight size={20} weight="bold" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <section className="max-w-7xl mx-auto min-h-[600px] mb-20 relative z-10">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-12"><PageFlipLoader /></motion.div>
            ) : results.length > 0 ? (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                {results.map((book, idx) => (
                  <BookCard key={book.googleBooksId || idx} book={book} delay={idx} />
                ))}
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 opacity-10">
                <div className="flex flex-col items-center gap-4"><Sparkle size={48} weight="thin" /><p className="text-xl italic font-serif">The archives await.</p></div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      <footer className="absolute bottom-12 left-0 right-0 text-center pointer-events-none">
        <p className="text-[10px] tracking-[0.5em] font-bold uppercase text-[#1A1A1A]/20">Lumina Digital Library</p>
      </footer>
    </main>
  );
}
