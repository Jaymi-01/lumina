"use client";

import { motion } from "framer-motion";
import { Sparkle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useLuminaStore } from "@/lib/store";

export function LuminaEntryLoader() {
  const { isMidnight } = useLuminaStore();

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Outer Glow */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={cn(
            "absolute inset-0 rounded-full blur-2xl",
            isMidnight ? "bg-indigo-500" : "bg-[#8C6A5E]"
          )}
        />

        {/* Pulsing Star */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className={cn(
            isMidnight ? "text-indigo-400" : "text-[#4A5D4E]"
          )}
        >
          <Sparkle size={48} weight="fill" />
        </motion.div>

        {/* Orbiting Sparkles */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0"
          >
            <motion.div
              animate={{
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              className={cn(
                "w-1 h-1 rounded-full absolute",
                i === 0 ? "top-0 left-1/2" : i === 1 ? "bottom-4 left-4" : "top-4 right-4",
                isMidnight ? "bg-white" : "bg-[#1A1A1A]"
              )}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
