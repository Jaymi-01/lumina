"use client";

import React, { useEffect, useRef } from "react";
import { useLuminaStore } from "@/lib/store";
import { SpeakerHigh, SpeakerSlash, MusicNotes } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function AmbientArchive() {
  const { ambientSound, setAmbientSound } = useLuminaStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (ambientSound === "theme") {
        audioRef.current.src = "/sounds/theme.mp3";
        audioRef.current.play().catch(() => {
          console.log("Audio playback blocked. Click the icon to start the music.");
          setAmbientSound(null);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [ambientSound, setAmbientSound]);

  const toggleMusic = () => {
    if (ambientSound === "theme") {
      setAmbientSound(null);
    } else {
      setAmbientSound("theme");
    }
  };

  return (
    <div className="fixed bottom-8 left-8 z-50">
      <button
        onClick={toggleMusic}
        className={cn(
          "group flex items-center gap-3 bg-white/40 backdrop-blur-xl p-2.5 pr-5 rounded-full border border-white/50 shadow-2xl transition-all active:scale-95",
          ambientSound === "theme" ? "ring-2 ring-[#4A5D4E] ring-offset-2" : ""
        )}
      >
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
          ambientSound === "theme" ? "bg-[#4A5D4E] text-white rotate-[360deg]" : "bg-[#1A1A1A] text-white"
        )}>
          {ambientSound === "theme" ? <SpeakerHigh size={20} weight="fill" /> : <SpeakerSlash size={20} weight="bold" />}
        </div>
        
        <div className="flex flex-col items-start">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]">
            {ambientSound === "theme" ? "Now Playing" : "Library Atmosphere"}
          </span>
          <span className="text-[11px] text-[#1A1A1A]/40 font-serif italic">
            Hedwig's Theme
          </span>
        </div>
      </button>
      <audio ref={audioRef} loop />
    </div>
  );
}
