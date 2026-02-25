"use client";

import { motion } from "framer-motion";
import { Rabbit, OrangeSlice } from "@phosphor-icons/react";

export function PageFlipLoader() {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* The Rabbit */}
        <motion.div
          animate={{
            y: [20, -15, 20],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute z-0 text-[#1A1A1A]/40"
        >
          <Rabbit size={64} weight="fill" />
        </motion.div>

        {/* The Hat (SVG for precise control) */}
        <div className="absolute z-10 bottom-0 w-24 h-20 bg-[#1A1A1A] rounded-b-lg flex flex-col items-center shadow-xl">
          {/* Hat Brim */}
          <div className="absolute -top-1 w-32 h-3 bg-[#1A1A1A] rounded-full shadow-md" />
          {/* Hat Ribbon */}
          <div className="absolute top-4 w-full h-4 bg-[#8C6A5E] opacity-50" />
        </div>

        {/* Magical Sparkles */}
        <motion.div
          animate={{
            scale: [0, 1.2, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: 0.5,
          }}
          className="absolute -top-6 -right-6 w-3 h-3 bg-yellow-200 rounded-full blur-[2px] shadow-[0_0_8px_white]"
        />
        <motion.div
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            delay: 1,
          }}
          className="absolute -top-2 -left-8 w-2 h-2 bg-yellow-100 rounded-full blur-[1px]"
        />
      </div>
      
      <p className="mt-12 font-serif italic text-[#4A5D4E] tracking-widest animate-pulse text-center">
        Accio! Summoning your library from the archives...
      </p>
    </div>
  );
}
