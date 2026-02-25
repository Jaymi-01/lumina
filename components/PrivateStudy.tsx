"use client";

import React, { useState } from "react";
import { useLuminaStore } from "@/lib/store";
import { BookCard } from "./BookCard";
import { Books, X, Sparkle } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

export function PrivateStudy() {
  const [isOpen, setIsOpen] = useState(false);
  const { favorites } = useLuminaStore();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-8 right-8 z-50 flex items-center gap-2 bg-white/40 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/50 shadow-xl hover:scale-105 transition-transform"
      >
        <Books size={20} weight="fill" className="text-[#4A5D4E]" />
        <span className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">Private Study</span>
        {favorites.length > 0 && (
          <span className="ml-1 bg-[#8C6A5E] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
            {favorites.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#F5F2ED]/95 backdrop-blur-md overflow-y-auto"
          >
            <div className="container mx-auto px-6 py-20">
              <div className="flex items-center justify-between mb-16">
                <div>
                  <h2 className="text-4xl font-serif font-bold text-[#1A1A1A] mb-2">The Private Study</h2>
                  <p className="text-[#1A1A1A]/40 italic">Your collection of summoned volumes.</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-4 bg-white rounded-full shadow-xl hover:scale-110 transition-transform"
                >
                  <X size={24} weight="bold" />
                </button>
              </div>

              {favorites.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                  {favorites.map((book, idx) => (
                    <BookCard key={book.googleBooksId || idx} book={book} delay={idx} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-40 opacity-20">
                  <Sparkle size={64} weight="thin" />
                  <p className="text-xl font-serif italic mt-4">Your study is empty... begin your journey in the library.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
