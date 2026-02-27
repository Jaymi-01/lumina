"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "@phosphor-icons/react";
import { useLuminaStore } from "@/lib/store";

const GENRES = ["Fantasy", "Sci-Fi", "Mystery", "Thriller", "Romance", "Historical", "Horror", "Biography", "Philosophy", "Poetry", "Self-Help", "Science", "True Crime", "Classic", "Contemporary", "African Literatures"];
const PACING = ["Fast-paced", "Moderate", "Slow-burn", "Breakneck", "Meditative"];
const TONES = ["Dark", "Uplifting", "Melancholic", "Whimsical", "Gritty", "Humorous", "Hopeful", "Suspenseful"];
const ERAS = ["Modern (Last 2 years)", "Recent (Last 10 years)", "21st Century", "20th Century", "Victorian Era", "Classic/Ancient"];

interface PreferenceSelectorProps {
  selectedGenres: string[];
  setSelectedGenres: React.Dispatch<React.SetStateAction<string[]>>;
  selectedPacing: string;
  setSelectedPacing: React.Dispatch<React.SetStateAction<string>>;
  selectedTone: string;
  setSelectedTone: React.Dispatch<React.SetStateAction<string>>;
  selectedEra: string;
  setSelectedEra: React.Dispatch<React.SetStateAction<string>>;
}

export function PreferenceSelector({
  selectedGenres, setSelectedGenres, selectedPacing, setSelectedPacing,
  selectedTone, setSelectedTone, selectedEra, setSelectedEra
}: PreferenceSelectorProps) {
  
  const { isMidnight } = useLuminaStore();
  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) { setSelectedGenres(prev => prev.filter(g => g !== genre)); } 
    else if (selectedGenres.length < 5) { setSelectedGenres(prev => [...prev, genre]); }
  };

  return (
    <div className="w-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-6">
        <h3 className={cn("text-xs font-bold uppercase tracking-[0.2em] transition-colors", isMidnight ? "text-white/20" : "text-[#1A1A1A]/40")}>The Age: Era</h3>
        <div className="flex flex-wrap gap-2">
          {ERAS.map(era => (
            <button key={era} onClick={() => setSelectedEra(era)} className={cn("px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-500 border", selectedEra === era ? (isMidnight ? "bg-indigo-500 text-white border-indigo-500 shadow-xl" : "bg-[#8C6A5E] text-white border-[#8C6A5E] shadow-xl") : (isMidnight ? "bg-white/5 border-white/10 text-white/40 hover:bg-white/10" : "bg-white/20 border-white/40 text-[#1A1A1A]/60 hover:bg-white/40"))}>
              {era}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h3 className={cn("text-xs font-bold uppercase tracking-[0.2em] transition-colors", isMidnight ? "text-white/20" : "text-[#1A1A1A]/40")}>The Blueprint: Reality</h3>
          <p className={cn("text-[11px] italic font-serif transition-colors", isMidnight ? "text-white/20" : "text-[#1A1A1A]/30")}>Select 1 to 5 genres.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {GENRES.map(genre => {
            const isSelected = selectedGenres.includes(genre);
            return (
              <button key={genre} onClick={() => toggleGenre(genre)} className={cn("px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-500 border", isSelected ? (isMidnight ? "bg-white text-slate-950 border-white shadow-xl scale-105" : "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xl scale-105") : (isMidnight ? "bg-white/5 border-white/10 text-white/40 hover:bg-white/10" : "bg-white/20 border-white/40 text-[#1A1A1A]/60 hover:bg-white/40"))}>
                {genre} {isSelected && <Check size={10} weight="bold" className="inline-ml-1.5 ml-1.5 opacity-50" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="space-y-6">
          <h3 className={cn("text-xs font-bold uppercase tracking-[0.2em] transition-colors", isMidnight ? "text-white/20" : "text-[#1A1A1A]/40")}>The Pulse: Pacing</h3>
          <div className="flex flex-wrap gap-2">
            {PACING.map(pace => (
              <button key={pace} onClick={() => setSelectedPacing(pace)} className={cn("px-5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-500 border", selectedPacing === pace ? (isMidnight ? "bg-indigo-500 text-white border-indigo-500 shadow-xl" : "bg-[#4A5D4E] text-white border-[#4A5D4E] shadow-xl") : (isMidnight ? "bg-white/5 border-white/10 text-white/40 hover:bg-white/10" : "bg-white/20 border-white/40 text-[#1A1A1A]/60 hover:bg-white/40"))}>
                {pace}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <h3 className={cn("text-xs font-bold uppercase tracking-[0.2em] transition-colors", isMidnight ? "text-white/20" : "text-[#1A1A1A]/40")}>The Spirit: Tone</h3>
          <div className="flex flex-wrap gap-2">
            {TONES.map(tone => (
              <button key={tone} onClick={() => setSelectedTone(tone)} className={cn("px-5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-500 border", selectedTone === tone ? (isMidnight ? "bg-white text-slate-950 border-white shadow-xl" : "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xl") : (isMidnight ? "bg-white/5 border-white/10 text-white/40 hover:bg-white/10" : "bg-white/20 border-white/40 text-[#1A1A1A]/60 hover:bg-white/40"))}>
                {tone}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
