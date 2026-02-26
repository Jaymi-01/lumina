"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

export function ElderWand() {
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
      
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === "pointer" || 
        target.tagName === "BUTTON" || 
        target.tagName === "A" ||
        target.closest('button') !== null ||
        target.closest('a') !== null
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden lg:block">
      {/* Outer Magical Aura */}
      <motion.div
        className="absolute w-12 h-12 rounded-full bg-yellow-200/30 blur-xl"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isPointer ? 1.5 : 1,
          opacity: isPointer ? 0.6 : 0.2
        }}
      />

      {/* Core Glowing Orb */}
      <motion.div
        className="absolute w-4 h-4 rounded-full bg-yellow-300 shadow-[0_0_20px_#fde047,0_0_40px_#fde047]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isPointer ? 1.2 : 1,
        }}
      />

      {/* Sharp Pointer Tip */}
      <motion.div
        className="absolute w-1 h-1 bg-white rounded-full z-10"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      <style jsx global>{`
        @media (min-width: 1024px) {
          html, body, *, button, a {
            cursor: none !important;
          }
        }
      `}</style>
    </div>
  );
}
