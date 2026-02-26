"use client";

import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Sparkle, ArrowRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useLuminaStore } from "@/lib/store";

interface VibeInputProps {
  onSearch: (vibe: string) => void;
  isLoading: boolean;
}

export function VibeInput({ onSearch, isLoading }: VibeInputProps) {
  const [vibe, setVibe] = useState("");
  const { isMidnight } = useLuminaStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vibe.trim() && !isLoading) { onSearch(vibe); }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6 flex flex-col items-center">
      <div className="relative w-full group">
        <TextareaAutosize
          autoFocus
          value={vibe}
          onChange={(e) => setVibe(e.target.value)}
          placeholder="I want a book that feels like a rainy Sunday in a cabin..."
          className={cn(
            "w-full backdrop-blur-sm border-2 rounded-2xl p-8 text-2xl font-serif transition-all duration-300 resize-none min-h-[160px] shadow-sm",
            isMidnight 
              ? "bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:ring-indigo-500/20 focus:border-indigo-500/50" 
              : "bg-white/40 border-[#1A1A1A]/10 text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:ring-[#4A5D4E]/20 focus:border-[#4A5D4E]/50"
          )}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
        />
        <div className={cn("absolute top-4 right-6 pointer-events-none transition-opacity group-focus-within:opacity-100 opacity-0", isMidnight ? "text-white/20" : "text-[#1A1A1A]/20")}>
          <Sparkle size={24} weight="fill" />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !vibe.trim()}
        className={cn(
          "group flex items-center gap-3 px-8 py-4 rounded-full text-xl font-bold tracking-tight shadow-lg transition-all active:scale-95 disabled:opacity-50",
          isMidnight ? "bg-indigo-500 text-white hover:bg-indigo-600" : "bg-[#4A5D4E] text-white hover:bg-[#3D4C40]"
        )}
      >
        <span>{isLoading ? "Summoning..." : "Accio"}</span>
        <ArrowRight size={24} weight="bold" className={cn("transition-transform", isLoading ? "animate-pulse" : "group-hover:translate-x-1")} />
      </button>
    </form>
  );
}
