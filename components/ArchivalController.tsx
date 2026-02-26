"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLuminaStore } from "@/lib/store";
import { 
  Books, 
  ClockCounterClockwise, 
  SpeakerSlash,
  SpeakerHigh,
  MusicNotes,
  X,
  Trash
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PrivateStudy } from "./PrivateStudy";
import { ArchiveEcho } from "./ArchiveEcho";

interface ArchivalControllerProps {
  onReSummon: (history: any) => void;
}

const SOUNDS = [
  { id: "theme", icon: MusicNotes, label: "Hedwig's Theme", url: "/sounds/theme.mp3" },
];

export function ArchivalController({ onReSummon }: ArchivalControllerProps) {
  const { ambientSound, setAmbientSound, favorites, history } = useLuminaStore();
  const [isStudyOpen, setIsStudyOpen] = useState(false);
  const [isEchoOpen, setIsEchoOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (ambientSound === "theme") {
        audioRef.current.src = "/sounds/theme.mp3";
        audioRef.current.play().catch(() => setAmbientSound(null));
      } else {
        audioRef.current.pause();
      }
    }
  }, [ambientSound, setAmbientSound]);

  return (
    <>
      <div className="fixed bottom-8 left-8 z-[100] flex items-center gap-2 bg-white/40 backdrop-blur-2xl p-2 rounded-full border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-[#1A1A1A]/5 transition-all duration-500">
        
        {/* Atmosphere Section - Now on the Left */}
        <div className="flex items-center gap-1 px-2 border-r border-[#1A1A1A]/10">
          <button
            onClick={() => setAmbientSound(ambientSound === "theme" ? null : "theme")}
            className={cn(
              "p-3 rounded-full transition-all flex items-center gap-2 px-4",
              ambientSound === "theme" ? "bg-[#4A5D4E] text-white" : "text-[#1A1A1A]/40 hover:bg-white/60"
            )}
          >
            {ambientSound === "theme" ? <SpeakerHigh size={20} weight="fill" className="animate-pulse" /> : <SpeakerSlash size={20} weight="bold" />}
            <span className="text-[9px] font-bold uppercase tracking-widest whitespace-nowrap">
              {ambientSound === "theme" ? "Atmosphere" : "Quiet"}
            </span>
          </button>
        </div>

        {/* Summons Section - Now on the Right */}
        <div className="flex items-center gap-1 px-2">
          <button
            onClick={() => setIsEchoOpen(true)}
            className={cn(
              "p-3 rounded-full transition-all hover:bg-white/60 relative group",
              isEchoOpen ? "bg-[#1A1A1A] text-white" : "text-[#1A1A1A]/60"
            )}
            title="Archive Echo"
          >
            <ClockCounterClockwise size={20} weight="bold" />
            {history.length > 0 && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#8C6A5E] rounded-full" />}
          </button>

          <button
            onClick={() => setIsStudyOpen(true)}
            className={cn(
              "p-3 rounded-full transition-all hover:bg-white/60 relative group",
              isStudyOpen ? "bg-[#1A1A1A] text-white" : "text-[#1A1A1A]/60"
            )}
            title="Private Study"
          >
            <Books size={20} weight="fill" />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#4A5D4E] text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {favorites.length}
              </span>
            )}
          </button>
        </div>

        <audio ref={audioRef} loop />
      </div>

      {/* Modals are kept in separate components for clean logic */}
      <StudyModal isOpen={isStudyOpen} onClose={() => setIsStudyOpen(false)} />
      <EchoModal isOpen={isEchoOpen} onClose={() => setIsEchoOpen(false)} onReSummon={onReSummon} />
    </>
  );
}

// Sub-components for Modals (Refactored from previous separate components)
function StudyModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { favorites } = useLuminaStore();
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-[#F5F2ED]/95 backdrop-blur-md overflow-y-auto">
          <div className="container mx-auto px-6 py-20">
            <div className="flex items-center justify-between mb-16">
              <h2 className="text-4xl font-serif font-bold text-[#1A1A1A]">The Private Study</h2>
              <button onClick={onClose} className="p-4 bg-white rounded-full shadow-xl hover:scale-110 transition-transform"><X size={24} weight="bold" /></button>
            </div>
            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                {favorites.map((book, idx) => (
                  <div key={book.googleBooksId || idx} onClick={(e) => e.stopPropagation()}>
                    <BookCard key={book.googleBooksId || idx} book={book} delay={idx} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-40 opacity-20"><Books size={64} weight="thin" /><p className="text-xl font-serif italic mt-4">Your study is empty.</p></div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function EchoModal({ isOpen, onClose, onReSummon }: { isOpen: boolean; onClose: () => void; onReSummon: (h: any) => void }) {
  const { history, clearHistory } = useLuminaStore();
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="fixed top-0 left-0 h-full w-[400px] z-[200] bg-white/90 backdrop-blur-2xl border-r border-[#1A1A1A]/10 shadow-2xl p-10 flex flex-col">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-serif font-bold text-[#1A1A1A]">Archive Echoes</h2>
            <button onClick={onClose}><X size={24} weight="bold" className="text-[#1A1A1A]/40 hover:text-[#1A1A1A]" /></button>
          </div>
          <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {history.map((item) => (
              <button key={item.id} onClick={() => { onReSummon(item); onClose(); }} className="w-full text-left p-5 rounded-2xl bg-white/50 border border-white/80 hover:bg-white hover:shadow-lg transition-all group">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#1A1A1A]/30">{item.mode}</span>
                  <span className="text-[9px] text-[#1A1A1A]/20 ml-auto">{new Date(item.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-xs text-[#1A1A1A]/70 italic line-clamp-2">{item.mode === "vibe" ? item.vibeText : `${item.preferences?.genres.join(", ")}`}</p>
              </button>
            ))}
          </div>
          {history.length > 0 && <button onClick={clearHistory} className="mt-8 flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-widest text-[#1A1A1A]/30 hover:text-red-500 transition-colors py-4 border-t border-[#1A1A1A]/5"><Trash size={14} /> Clear Archive</button>}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Re-importing BookCard here to avoid circular dependency if needed, but since it's used in page we assume it's available
import { BookCard } from "./BookCard";
