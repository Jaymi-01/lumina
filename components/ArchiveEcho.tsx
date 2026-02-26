"use client";

import React, { useState } from "react";
import { useLuminaStore, SummoningHistory } from "@/lib/store";
import { ClockCounterClockwise, X, Wind, ListDashes, Trash } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ArchiveEchoProps {
  onReSummon: (history: SummoningHistory) => void;
}

export function ArchiveEcho({ onReSummon }: ArchiveEchoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { history, clearHistory } = useLuminaStore();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 left-8 z-50 flex items-center gap-2 bg-white/40 backdrop-blur-xl px-4 py-2.5 rounded-full border border-white/50 shadow-xl hover:scale-105 transition-transform"
      >
        <ClockCounterClockwise size={20} weight="bold" className="text-[#4A5D4E]" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]">Archive Echo</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed top-0 left-0 h-full w-[350px] z-[100] bg-[#F5F2ED]/95 backdrop-blur-xl border-r border-[#1A1A1A]/10 shadow-2xl p-8 flex flex-col"
          >
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-3">
                <ClockCounterClockwise size={24} weight="fill" className="text-[#4A5D4E]" />
                <h2 className="text-xl font-serif font-bold text-[#1A1A1A]">Recent Echos</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-[#1A1A1A]/40 hover:text-[#1A1A1A]">
                <X size={24} weight="bold" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {history.length > 0 ? (
                history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onReSummon(item);
                      setIsOpen(false);
                    }}
                    className="w-full text-left p-4 rounded-2xl bg-white/40 border border-white/60 hover:bg-white/80 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {item.mode === "vibe" ? (
                        <Wind size={14} weight="fill" className="text-[#4A5D4E]/60" />
                      ) : (
                        <ListDashes size={14} weight="bold" className="text-[#8C6A5E]/60" />
                      )}
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#1A1A1A]/30">
                        {item.mode === "vibe" ? "Vibe" : "Blueprint"}
                      </span>
                      <span className="text-[9px] text-[#1A1A1A]/20 ml-auto font-medium">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-[#1A1A1A]/70 line-clamp-2 italic font-serif leading-relaxed">
                      {item.mode === "vibe" ? item.vibeText : `${item.preferences?.genres.join(", ")} - ${item.preferences?.era}`}
                    </p>
                  </button>
                ))
              ) : (
                <div className="text-center py-20 opacity-20">
                  <p className="text-sm italic font-serif">No echos found in the archives.</p>
                </div>
              )}
            </div>

            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="mt-8 flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-widest text-[#1A1A1A]/30 hover:text-red-500 transition-colors py-4 border-t border-[#1A1A1A]/5"
              >
                <Trash size={14} /> Clear Archive
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
