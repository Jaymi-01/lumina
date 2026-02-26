"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VibeInput } from "@/components/VibeInput";
import { PreferenceSelector } from "@/components/PreferenceSelector";
import { BookCard, CaptureBookCard } from "@/components/BookCard";
import { PageFlipLoader } from "@/components/PageFlipLoader";
import { PrivateStudy } from "@/components/PrivateStudy";
import { AmbientArchive } from "@/components/AmbientArchive";
import { ArchiveEcho } from "@/components/ArchiveEcho";
import { ElderWand } from "@/components/ElderWand";
import { getRecommendations, type BookRecommendation } from "./actions";
import { BookOpenText, Sparkle, Wind, ListDashes, ArrowRight, Camera, LockKey } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { domToPng } from "modern-screenshot";
import { toast } from "sonner";
import { useLuminaStore, type SummoningHistory } from "@/lib/store";

export default function Home() {
  const [mode, setMode] = useState<"vibe" | "blueprint">("vibe");
  const [results, setResults] = useState<BookRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);
  
  const { addHistory } = useLuminaStore();

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedPacing, setSelectedPacing] = useState("");
  const [selectedTone, setSelectedTone] = useState("");
  const [selectedEra, setSelectedEra] = useState("");

  const handleSearch = async (vibeText?: string, isRestricted = false) => {
    setIsLoading(true);
    setResults([]);
    
    const searchMode = isRestricted ? "restricted" : mode;
    
    try {
      const response = await getRecommendations(searchMode, vibeText, selectedGenres, selectedPacing, selectedTone, selectedEra);
      if (response) {
        setResults(response.recommendations);
        toast.success(isRestricted ? "The Restricted Section has opened..." : "Volumes summoned!");
        
        // Record History
        if (!isRestricted) {
          addHistory({
            mode,
            vibeText,
            preferences: mode === "blueprint" ? {
              genres: selectedGenres,
              pacing: selectedPacing,
              tone: selectedTone,
              era: selectedEra
            } : undefined
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
      // Wait for state to apply
      setTimeout(() => handleSearch(), 50);
    }
  };

  const exportImage = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (captureRef.current && !isCapturing) {
      setIsCapturing(true);
      const captureToast = toast.loading("Capturing archival records...");
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const dataUrl = await domToPng(captureRef.current, { backgroundColor: '#F5F2ED', scale: 2 });
        if (dataUrl) {
          const link = document.createElement('a');
          link.download = `lumina-archive-${Date.now()}.png`;
          link.href = dataUrl;
          link.click();
          toast.success("Magic captured!", { id: captureToast });
        }
      } catch (err) {
        toast.error("Capture failed.", { id: captureToast });
      } finally { setIsCapturing(false); }
    }
  };

  const isBlueprintValid = selectedGenres.length > 0 && selectedPacing && selectedTone && selectedEra;

  return (
    <main className="min-h-screen relative overflow-x-hidden pb-32 bg-[#F5F2ED] selection:bg-[#4A5D4E] selection:text-white">
      <ElderWand />
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />

      <PrivateStudy />
      <ArchiveEcho onReSummon={handleReSummon} />
      <AmbientArchive />

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

          <button
            onClick={() => handleSearch(undefined, true)}
            disabled={isLoading}
            className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#1A1A1A]/30 hover:text-[#8C6A5E] transition-all"
          >
            <LockKey size={16} weight="fill" className="group-hover:rotate-12 transition-transform" />
            Enter Restricted Section
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

        {results.length > 0 && (
          <div className="max-w-7xl mx-auto px-8 mb-8 flex justify-end">
            <button onClick={exportImage} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/40 hover:text-[#4A5D4E] transition-colors bg-white/40 backdrop-blur-md p-3 rounded-xl border border-white/50 shadow-sm">
              <Camera size={18} weight="bold" /> Capture the Magic
            </button>
          </div>
        )}

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

        <div className="absolute top-0 left-0 w-0 h-0 overflow-hidden pointer-events-none opacity-0 select-none z-[-100]">
          <div ref={captureRef} className="p-16 w-[1400px] bg-[#F5F2ED] flex flex-col items-center">
            <div className="mb-12 text-center">
              <h2 className="text-xs font-bold uppercase tracking-[0.5em] text-[#1A1A1A]/20 mb-4">Summoned Volumes</h2>
              <div className="flex items-center justify-center gap-2 opacity-40">
                <div className="h-px w-12 bg-[#1A1A1A]" />
                <span className="text-[10px] font-serif italic uppercase tracking-widest text-[#1A1A1A]">Lumina Digital Library</span>
                <div className="h-px w-12 bg-[#1A1A1A]" />
              </div>
            </div>
            <div className="grid grid-cols-5 gap-8 w-full">
              {results.map((book, idx) => (
                <CaptureBookCard key={idx} book={book} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="absolute bottom-12 left-0 right-0 text-center pointer-events-none">
        <p className="text-[10px] tracking-[0.5em] font-bold uppercase text-[#1A1A1A]/20">Lumina Digital Library</p>
      </footer>
    </main>
  );
}
