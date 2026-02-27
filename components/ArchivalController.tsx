"use client";

import { useEffect, useRef, useState } from "react";
import { useLuminaStore, type SummoningHistory } from "@/lib/store";
import { 
  Books, 
  ClockCounterClockwise, 
  SpeakerSlash,
  SpeakerHigh,
  MusicNotes,
  X,
  Trash,
  Moon,
  Sun,
  Question,
  Info,
  LockKey
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { BookCard } from "./BookCard";

interface ArchivalControllerProps {
  onReSummon: (history: SummoningHistory) => void;
}

export function ArchivalController({ onReSummon }: ArchivalControllerProps) {
  const { ambientSound, setAmbientSound, favorites, history, isMidnight, toggleMidnight, hasSeenGuide, setHasSeenGuide } = useLuminaStore();
  const [isStudyOpen, setIsStudyOpen] = useState(false);
  const [isEchoOpen, setIsEchoOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Only show guide if it's the first time
    if (!hasSeenGuide) {
      const timer = setTimeout(() => {
        setIsGuideOpen(true);
      }, 2000); // Slight delay for the magic to feel right
      return () => clearTimeout(timer);
    }
  }, [hasSeenGuide]);

  const closeGuide = () => {
    setIsGuideOpen(false);
    if (!hasSeenGuide) setHasSeenGuide(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      if (ambientSound === "theme") {
        audioRef.current.src = "/sounds/theme.mp3";
        audioRef.current.volume = 0.3; // Reduced volume
        audioRef.current.play().catch(() => setAmbientSound(null));
      } else {
        audioRef.current.pause();
      }
    }
  }, [ambientSound, setAmbientSound]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (audioRef.current && !audioRef.current.paused) {
          audioRef.current.pause();
        }
      } else {
        // Stop the song when coming back (ensure it stays paused or stops)
        if (ambientSound === "theme" && audioRef.current) {
          audioRef.current.pause();
          setAmbientSound(null); // Explicitly turn off the atmosphere on return
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [ambientSound, setAmbientSound]);

  return (
    <>
      <div className={cn(
        "fixed bottom-8 left-8 z-[100] flex items-center gap-2 backdrop-blur-2xl p-2 rounded-full border shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 transition-all duration-700",
        isMidnight 
          ? "bg-indigo-950/40 border-white/10 ring-white/5 shadow-indigo-900/20" 
          : "bg-white/40 border-white/50 ring-[#1A1A1A]/5 shadow-black/15"
      )}>
        
        {/* Atmosphere Section */}
        <div className={cn("flex items-center gap-1 px-2 border-r", isMidnight ? "border-white/10" : "border-[#1A1A1A]/10")}>
          <button
            onClick={() => setAmbientSound(ambientSound === "theme" ? null : "theme")}
            className={cn(
              "p-3 rounded-full transition-all flex items-center gap-2 px-4",
              ambientSound === "theme" 
                ? (isMidnight ? "bg-indigo-500 text-white" : "bg-[#4A5D4E] text-white") 
                : (isMidnight ? "text-white/40 hover:bg-white/10" : "text-[#1A1A1A]/40 hover:bg-white/60")
            )}
          >
            {ambientSound === "theme" ? <SpeakerHigh size={20} weight="fill" className="animate-pulse" /> : <SpeakerSlash size={20} weight="bold" />}
            <span className="text-[9px] font-bold uppercase tracking-widest whitespace-nowrap">
              {ambientSound === "theme" ? "Atmosphere" : "Quiet"}
            </span>
          </button>

          <button
            onClick={toggleMidnight}
            className={cn(
              "p-3 rounded-full transition-all",
              isMidnight ? "text-yellow-400 hover:bg-white/10" : "text-[#1A1A1A]/40 hover:bg-white/60"
            )}
            title={isMidnight ? "Return to Daylight" : "Enter Midnight Archive"}
          >
            {isMidnight ? <Sun size={20} weight="fill" /> : <Moon size={20} weight="bold" />}
          </button>
        </div>

        {/* Summons Section */}
        <div className={cn("flex items-center gap-1 px-2 border-r", isMidnight ? "border-white/10" : "border-[#1A1A1A]/10")}>
          <button
            onClick={() => setIsEchoOpen(true)}
            className={cn(
              "p-3 rounded-full transition-all relative group",
              isEchoOpen 
                ? (isMidnight ? "bg-white text-indigo-950" : "bg-[#1A1A1A] text-white") 
                : (isMidnight ? "text-white/40 hover:bg-white/10" : "text-[#1A1A1A]/60 hover:bg-white/60")
            )}
            title="Archive Echo"
          >
            <ClockCounterClockwise size={20} weight="bold" />
            {history.length > 0 && <div className={cn("absolute top-2 right-2 w-1.5 h-1.5 rounded-full", isMidnight ? "bg-indigo-400" : "bg-[#8C6A5E]")} />}
          </button>

          <button
            onClick={() => setIsStudyOpen(true)}
            className={cn(
              "p-3 rounded-full transition-all relative group",
              isStudyOpen 
                ? (isMidnight ? "bg-white text-indigo-950" : "bg-[#1A1A1A] text-white") 
                : (isMidnight ? "text-white/40 hover:bg-white/10" : "text-[#1A1A1A]/60 hover:bg-white/60")
            )}
            title="Private Study"
          >
            <Books size={20} weight="fill" />
            {favorites.length > 0 && (
              <span className={cn(
                "absolute -top-1 -right-1 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-bold",
                isMidnight ? "bg-indigo-500" : "bg-[#4A5D4E]"
              )}>
                {favorites.length}
              </span>
            )}
          </button>
        </div>

        {/* Help Section */}
        <div className="flex items-center gap-1 px-2">
          <button
            onClick={() => setIsGuideOpen(true)}
            className={cn(
              "p-3 rounded-full transition-all",
              isMidnight ? "text-white/40 hover:bg-white/10" : "text-[#1A1A1A]/40 hover:bg-white/60"
            )}
            title="Librarian's Guide"
          >
            <Question size={20} weight="bold" />
          </button>
        </div>

        <audio ref={audioRef} loop />
      </div>

      <StudyModal isOpen={isStudyOpen} onClose={() => setIsStudyOpen(false)} isMidnight={isMidnight} />
      <EchoModal isOpen={isEchoOpen} onClose={() => setIsEchoOpen(false)} onReSummon={onReSummon} isMidnight={isMidnight} />
      <GuideModal isOpen={isGuideOpen} onClose={closeGuide} isMidnight={isMidnight} />
    </>
  );
}

function StudyModal({ isOpen, onClose, isMidnight }: { isOpen: boolean; onClose: () => void; isMidnight: boolean }) {
  const { favorites } = useLuminaStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, x: 50 }} 
          animate={{ opacity: 1, x: 0 }} 
          exit={{ opacity: 0, x: 50 }} 
          className={cn(
            "fixed top-4 right-4 bottom-4 w-full md:w-[500px] z-[200] backdrop-blur-2xl border shadow-2xl p-10 flex flex-col rounded-[32px]",
            isMidnight ? "bg-indigo-950/90 border-white/5" : "bg-white/95 border-[#1A1A1A]/10"
          )}
        >
          <div className="flex items-center justify-between mb-12">
            <h2 className={cn("text-3xl font-serif font-bold", isMidnight ? "text-white" : "text-[#1A1A1A]")}>The Private Study</h2>
            <button onClick={onClose} className="p-2 transition-transform hover:scale-110">
              <X size={20} weight="bold" className={cn(isMidnight ? "text-white/40 hover:text-white" : "text-[#1A1A1A]/40 hover:text-[#1A1A1A]")} />
            </button>
          </div>
          
          <div className="flex-grow overflow-y-auto space-y-8 pr-2 custom-scrollbar">
            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 gap-8">
                {favorites.map((book, idx) => (
                  <div key={book.googleBooksId || idx} className="w-full h-[540px]">
                    <BookCard book={book} delay={idx} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-40 opacity-20">
                <Books size={64} weight="thin" className={isMidnight ? "text-white" : ""} />
                <p className={cn("text-xl font-serif italic mt-4", isMidnight ? "text-white" : "")}>Your study is empty.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function EchoModal({ isOpen, onClose, onReSummon, isMidnight }: { isOpen: boolean; onClose: () => void; onReSummon: (h: SummoningHistory) => void; isMidnight: boolean }) {
  const { history, clearHistory } = useLuminaStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, x: -50 }} 
          animate={{ opacity: 1, x: 0 }} 
          exit={{ opacity: 0, x: -50 }} 
          className={cn(
            "fixed top-4 left-4 bottom-4 w-full md:w-[400px] z-[200] backdrop-blur-2xl border shadow-2xl p-10 flex flex-col rounded-[32px]",
            isMidnight ? "bg-indigo-950/90 border-white/5" : "bg-white/90 border-[#1A1A1A]/10"
          )}
        >
          <div className="flex items-center justify-between mb-12">
            <h2 className={cn("text-2xl font-serif font-bold", isMidnight ? "text-white" : "text-[#1A1A1A]")}>Archive Echoes</h2>
            <button onClick={onClose} className="p-2 transition-transform hover:scale-110">
              <X size={20} weight="bold" className={cn(isMidnight ? "text-white/40 hover:text-white" : "text-[#1A1A1A]/40 hover:text-[#1A1A1A]")} />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {history.map((item) => (
              <button key={item.id} onClick={() => { onReSummon(item); onClose(); }} className={cn("w-full text-left p-5 rounded-2xl border transition-all group", isMidnight ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white/50 border-white/80 hover:bg-white hover:shadow-lg")}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn("text-[9px] font-bold uppercase tracking-widest", isMidnight ? "text-white/30" : "text-[#1A1A1A]/30")}>{item.mode}</span>
                  <span className={cn("text-[9px] ml-auto", isMidnight ? "text-white/20" : "text-[#1A1A1A]/20")}>{new Date(item.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className={cn("text-xs italic line-clamp-2", isMidnight ? "text-white/70" : "text-[#1A1A1A]/70")}>{item.mode === "vibe" ? item.vibeText : `${item.preferences?.genres.join(", ")}`}</p>
              </button>
            ))}
          </div>
          {history.length > 0 && <button onClick={clearHistory} className={cn("mt-8 flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-widest transition-colors py-4 border-t", isMidnight ? "text-white/30 hover:text-red-400 border-white/5" : "text-[#1A1A1A]/30 hover:text-red-500 border-[#1A1A1A]/5")}><Trash size={14} /> Clear Archive</button>}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function GuideModal({ isOpen, onClose, isMidnight }: { isOpen: boolean; onClose: () => void; isMidnight: boolean }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const steps = [
    {
      title: "Choose Your Path",
      desc: "Use 'The Vibe' to describe a feeling or 'The Blueprint' to specify genres and pacing.",
      icon: <Info size={24} />
    },
    {
      title: "Set the Mood",
      desc: "Toggle 'Atmosphere' for ambient music and 'Midnight Archive' for a darker aesthetic.",
      icon: <MusicNotes size={24} />
    },
    {
      title: "Build Your Collection",
      desc: "Click the bookmark on any book to save it to your 'Private Study'.",
      icon: <Books size={24} />
    },
    {
      title: "The Restricted Section",
      desc: "A hidden portal for specialized archival requests.",
      icon: <LockKey size={24} />
    },
    {
      title: "Summoning Failures",
      desc: "If a book doesn't come up on the first try, it may be due to API rate limiting. Please try again.",
      icon: <ClockCounterClockwise size={24} />
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn(
              "relative w-full max-w-lg max-h-[85vh] overflow-y-auto p-10 rounded-[32px] border shadow-2xl custom-scrollbar",
              isMidnight ? "bg-indigo-950 border-white/10 text-white" : "bg-[#F5F2ED] border-black/5 text-[#1A1A1A]"
            )}
          >
            <button onClick={onClose} className="absolute top-8 right-8 p-2 opacity-40 hover:opacity-100 transition-opacity">
              <X size={20} weight="bold" />
            </button>
            
            <h2 className="text-3xl font-serif font-bold mb-2">Librarian's Guide</h2>
            <p className="text-sm opacity-60 mb-10">Welcome to Lumina. Here is how to navigate the archives.</p>
            
            <div className="space-y-8">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-6">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", isMidnight ? "bg-white/5" : "bg-black/5")}>
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-widest mb-1">{step.title}</h3>
                    <p className="text-sm opacity-60 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={onClose}
              className={cn(
                "w-full mt-10 py-4 rounded-2xl font-bold transition-all hover:scale-[1.02]",
                isMidnight ? "bg-white text-indigo-950" : "bg-[#1A1A1A] text-white"
              )}
            >
              Begin Archiving
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
