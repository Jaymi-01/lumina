"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VibeInput } from "@/components/VibeInput";
import { PreferenceSelector } from "@/components/PreferenceSelector";
import { BookCard } from "@/components/BookCard";
import { PageFlipLoader } from "@/components/PageFlipLoader";
import { LuminaEntryLoader } from "@/components/LuminaEntryLoader";
import { ArchivalController } from "@/components/ArchivalController";
import { ElderWand } from "@/components/ElderWand";
import { getRecommendations, type BookRecommendation } from "./actions";
import { BookOpenText, Sparkle, Wind, ListDashes, ArrowRight, LockKey } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useLuminaStore, type SummoningHistory } from "@/lib/store";

export default function Home() {
  const [results, setResults] = useState<BookRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const { addHistory, isMidnight } = useLuminaStore();

  useEffect(() => {
    // Artificial delay to show the beautiful loading screen
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const [mode, setMode] = useState<"vibe" | "blueprint">("vibe");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedPacing, setSelectedPacing] = useState("");
  const [selectedTone, setSelectedTone] = useState("");
  const [selectedEra, setSelectedEra] = useState("");

  const handleSearch = async (vibeText?: string, isRestricted = false, overridePrefs?: SummoningHistory["preferences"]) => {
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
          addHistory({ mode, vibeText, preferences: mode === "blueprint" ? { genres, pacing, tone, era } : undefined });
        }
      }
    } catch (error) { toast.error("The archives are quiet. Try again."); } finally { setIsLoading(false); }
  };

  const handleReSummon = (history: SummoningHistory) => {
    setMode(history.mode);
    if (history.mode === "vibe") { handleSearch(history.vibeText); } 
    else if (history.preferences) {
      setSelectedGenres(history.preferences.genres); setSelectedPacing(history.preferences.pacing);
      setSelectedTone(history.preferences.tone); setSelectedEra(history.preferences.era);
      handleSearch(undefined, false, history.preferences);
    }
  };

  const isBlueprintValid = selectedGenres.length > 0 && selectedPacing && selectedTone && selectedEra;

  return (
    <>
      <AnimatePresence>
        {isAppLoading && (
          <motion.div
            key="app-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className={cn(
              "fixed inset-0 z-[1000] flex flex-col items-center justify-center transition-colors duration-1000",
              isMidnight ? "bg-slate-950" : "bg-[#F5F2ED]"
            )}
          >
            <LuminaEntryLoader />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={cn(
                "mt-4 text-[10px] font-bold uppercase tracking-[0.5em]",
                isMidnight ? "text-white/20" : "text-[#1A1A1A]/20"
              )}
            >
              Opening the Archives
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className={cn(
        "min-h-screen relative overflow-x-hidden pb-32 transition-colors duration-1000 ease-in-out selection:bg-[#4A5D4E] selection:text-white",
        isMidnight ? "bg-slate-950" : "bg-[#F5F2ED]"
      )}>
      <ElderWand />
      <div className={cn("fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]", isMidnight && "invert")} />

      <ArchivalController onReSummon={handleReSummon} />

      <div className="container mx-auto px-6 pt-16 pb-12 relative z-10">
        <header className="max-w-4xl mx-auto text-center mb-20">
          <div className={cn("inline-flex items-center justify-center p-3 rounded-full backdrop-blur-md border mb-8 shadow-sm transition-colors", isMidnight ? "bg-white/5 border-white/10" : "bg-white/30 border-white/50")}>
            <BookOpenText size={24} weight="fill" className={isMidnight ? "text-white/60" : "text-[#1A1A1A]/60"} />
          </div>
          <h1 className={cn("text-6xl md:text-8xl font-serif font-bold tracking-tighter transition-colors", isMidnight ? "text-white" : "text-[#1A1A1A]")}>Lumina</h1>
          <p className={cn("text-lg md:text-xl max-w-lg mx-auto italic font-medium transition-colors", isMidnight ? "text-white/40" : "text-[#1A1A1A]/40")}>The Digital Librarian for discovery.</p>
        </header>

        <div className="max-w-md mx-auto mb-16 relative z-20 flex flex-col items-center gap-6">
          <div className={cn("backdrop-blur-xl p-1.5 rounded-2xl border flex shadow-inner w-full transition-colors", isMidnight ? "bg-white/5 border-white/10" : "bg-white/20 border-white/40")}>
            <button onClick={() => setMode("vibe")} className={cn("flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all", mode === "vibe" ? (isMidnight ? "bg-indigo-500 text-white shadow-lg" : "bg-white text-[#1A1A1A] shadow-lg") : (isMidnight ? "text-white/40" : "text-[#1A1A1A]/40"))}>
              <Wind size={18} weight="fill" /> The Vibe
            </button>
            <button onClick={() => setMode("blueprint")} className={cn("flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all", mode === "blueprint" ? (isMidnight ? "bg-indigo-500 text-white shadow-lg" : "bg-white text-[#1A1A1A] shadow-lg") : (isMidnight ? "text-white/40" : "text-[#1A1A1A]/40"))}>
              <ListDashes size={18} weight="fill" /> The Blueprint
            </button>
          </div>
          <button onClick={() => handleSearch(undefined, true)} disabled={isLoading} className={cn("group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] transition-all", isMidnight ? "text-white/20 hover:text-indigo-400" : "text-[#1A1A1A]/30 hover:text-[#8C6A5E]")}>
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
              <motion.div key="blueprint" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center text-left">
                <PreferenceSelector 
                  selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres}
                  selectedPacing={selectedPacing} setSelectedPacing={setSelectedPacing}
                  selectedTone={selectedTone} setSelectedTone={setSelectedTone}
                  selectedEra={selectedEra} setSelectedEra={setSelectedEra}
                />
                <button onClick={() => handleSearch()} disabled={isLoading || !isBlueprintValid} className={cn("mt-16 group flex items-center gap-4 px-10 py-5 rounded-full text-lg font-bold shadow-2xl transition-all hover:-translate-y-1 disabled:opacity-20", isMidnight ? "bg-indigo-500 text-white" : "bg-[#1A1A1A] text-white")}>
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
                <div className="flex flex-col items-center gap-4"><Sparkle size={48} weight="thin" className={isMidnight ? "text-white" : ""} /><p className={cn("text-xl italic font-serif", isMidnight ? "text-white" : "")}>The archives await.</p></div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      <footer className="absolute bottom-12 left-0 right-0 text-center pointer-events-none">
        <p className={cn("text-[10px] tracking-[0.5em] font-bold uppercase transition-colors", isMidnight ? "text-white/10" : "text-[#1A1A1A]/20")}>Lumina Digital Library</p>
      </footer>
    </main>
    </>
  );
}
