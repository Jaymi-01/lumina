"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VibeInput } from "@/components/VibeInput";
import { PreferenceSelector } from "@/components/PreferenceSelector";
import { BookCard } from "@/components/BookCard";
import { PageFlipLoader } from "@/components/PageFlipLoader";
import { PrivateStudy } from "@/components/PrivateStudy";
import { AmbientArchive } from "@/components/AmbientArchive";
import { getRecommendations, type BookRecommendation } from "./actions";
import { BookOpenText, Sparkle, Wind, ListDashes, ArrowRight, Camera } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { toPng } from "html-to-image";

export default function Home() {
  const [mode, setMode] = useState<"vibe" | "blueprint">("vibe");
  const [results, setResults] = useState<BookRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);
  
  // Selection states
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedPacing, setSelectedPacing] = useState("");
  const [selectedTone, setSelectedTone] = useState("");
  const [selectedEra, setSelectedEra] = useState("");

  const handleSearch = async (vibeText?: string) => {
    setIsLoading(true);
    setResults([]);
    
    try {
      const response = await getRecommendations(
        mode,
        vibeText,
        selectedGenres,
        selectedPacing,
        selectedTone,
        selectedEra
      );
      if (response) {
        setResults(response.recommendations);
      }
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportImage = async () => {
    if (captureRef.current) {
      setIsLoading(true);
      try {
        // Give the UI a moment to settle
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const dataUrl = await toPng(captureRef.current, { 
          cacheBust: true, 
          backgroundColor: '#F5F2ED',
          style: {
            padding: '40px',
            borderRadius: '40px'
          },
          pixelRatio: 2 // High resolution
        });
        
        const link = document.createElement('a');
        link.download = `lumina-summoning-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to capture magic:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isBlueprintValid = selectedGenres.length > 0 && selectedPacing && selectedTone && selectedEra;

  return (
    <main className="min-h-screen relative overflow-x-hidden pb-32 bg-[#F5F2ED] selection:bg-[#4A5D4E] selection:text-white">
      {/* Background Texture */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />

      {/* Persistent UI Elements */}
      <PrivateStudy />
      <AmbientArchive />

      <div className="container mx-auto px-6 pt-16 pb-12 relative z-10">
        {/* Header */}
        <header className="max-w-4xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center p-3 rounded-full bg-white/30 backdrop-blur-md border border-white/50 mb-8 shadow-sm"
          >
            <BookOpenText size={24} weight="fill" className="text-[#1A1A1A]/60" />
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tighter text-[#1A1A1A] mb-6">
            Lumina
          </h1>
          <p className="text-lg md:text-xl font-body text-[#1A1A1A]/40 max-w-lg mx-auto italic font-medium leading-relaxed">
            The Digital Librarian for those who seek more than just a search result.
          </p>
        </header>

        {/* Mode Switcher */}
        <div className="max-w-md mx-auto mb-16">
          <div className="bg-white/20 backdrop-blur-xl p-1.5 rounded-2xl border border-white/40 flex shadow-inner">
            <button
              onClick={() => setMode("vibe")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-500",
                mode === "vibe" 
                  ? "bg-white text-[#1A1A1A] shadow-lg scale-[1.02]" 
                  : "text-[#1A1A1A]/40 hover:text-[#1A1A1A]/60"
              )}
            >
              <Wind size={18} weight={mode === "vibe" ? "fill" : "bold"} />
              The Vibe
            </button>
            <button
              onClick={() => setMode("blueprint")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-500",
                mode === "blueprint" 
                  ? "bg-white text-[#1A1A1A] shadow-lg scale-[1.02]" 
                  : "text-[#1A1A1A]/40 hover:text-[#1A1A1A]/60"
              )}
            >
              <ListDashes size={18} weight={mode === "blueprint" ? "fill" : "bold"} />
              The Blueprint
            </button>
          </div>
        </div>

        {/* Input Sections */}
        <section className="max-w-5xl mx-auto mb-24">
          <AnimatePresence mode="wait">
            {mode === "vibe" ? (
              <motion.div
                key="vibe"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                <VibeInput onSearch={handleSearch} isLoading={isLoading} />
              </motion.div>
            ) : (
              <motion.div
                key="blueprint"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <PreferenceSelector 
                  selectedGenres={selectedGenres}
                  setSelectedGenres={setSelectedGenres}
                  selectedPacing={selectedPacing}
                  setSelectedPacing={setSelectedPacing}
                  selectedTone={selectedTone}
                  setSelectedTone={setSelectedTone}
                  selectedEra={selectedEra}
                  setSelectedEra={setSelectedEra}
                />
                
                <button
                  onClick={() => handleSearch()}
                  disabled={isLoading || !isBlueprintValid}
                  className={cn(
                    "mt-16 group flex items-center gap-4 bg-[#1A1A1A] text-white px-10 py-5 rounded-full text-lg font-bold shadow-2xl transition-all active:scale-95 disabled:opacity-20",
                    "hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:-translate-y-1"
                  )}
                >
                  <span>{isLoading ? "Summoning..." : "Accio"}</span>
                  <ArrowRight size={20} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Results Container */}
        <div ref={captureRef} className="p-8 rounded-[2rem] bg-transparent">
          {results.length > 0 && (
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-[#1A1A1A]/20">Summoned Volumes</h2>
              <button
                onClick={exportImage}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/40 hover:text-[#4A5D4E] transition-colors"
              >
                <Camera size={16} /> Capture the Magic
              </button>
            </div>
          )}

          <section className="max-w-7xl mx-auto min-h-[600px] mb-20">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12"
                >
                  <PageFlipLoader />
                </motion.div>
              ) : results.length > 0 ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8"
                >
                  {results.map((book, idx) => (
                    <BookCard key={book.googleBooksId || idx} book={book} delay={idx} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 opacity-10 pointer-events-none"
                >
                  <div className="flex flex-col items-center gap-4">
                    <Sparkle size={48} weight="thin" />
                    <p className="text-xl italic font-serif">The archives await your direction.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </div>

      <footer className="absolute bottom-12 left-0 right-0 text-center pointer-events-none">
        <p className="text-[10px] tracking-[0.5em] font-bold uppercase text-[#1A1A1A]/20">
          Lumina Digital Library
        </p>
      </footer>
    </main>
  );
}
