"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkle, Info, ArrowUpRight, BookOpen, Quotes, Bookmark } from "@phosphor-icons/react";
import { cleanHtml, truncate } from "@/lib/utils";
import Image from "next/image";
import { type BookRecommendation } from "@/app/actions";
import { cn } from "@/lib/utils";
import { useLuminaStore } from "@/lib/store";

export function BookCard({ book, delay = 0 }: { book: BookRecommendation; delay?: number }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cleanDescription = cleanHtml(book.description);
  const { addFavorite, removeFavorite, isFavorite } = useLuminaStore();
  
  const isSaved = book.googleBooksId ? isFavorite(book.googleBooksId) : false;

  const toggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!book.googleBooksId) return;
    if (isSaved) {
      removeFavorite(book.googleBooksId);
    } else {
      addFavorite(book);
    }
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className="group perspective-1000 h-[520px] w-full"
      onClick={handleCardClick}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          rotateY: isFlipped ? 180 : 0 
        }}
        transition={{ 
          y: { duration: 0.6, delay: delay * 0.1 },
          opacity: { duration: 0.6, delay: delay * 0.1 },
          rotateY: { duration: 0.7, ease: "easeInOut" }
        }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full h-full cursor-pointer shadow-2xl rounded-2xl"
      >
        {/* FRONT: The Cover */}
        <div 
          className="absolute inset-0 rounded-2xl overflow-hidden bg-white border border-[#1A1A1A]/10 flex flex-col"
          style={{ 
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden"
          }}
        >
          {/* Cover Image Container */}
          <div className="relative h-[55%] w-full bg-[#F5F2ED] overflow-hidden border-b border-[#1A1A1A]/5">
            {book.thumbnail ? (
              <Image
                src={book.thumbnail}
                alt={book.title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 20vw"
                priority
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-[#1A1A1A]/20">
                <BookOpen size={64} weight="thin" />
                <span className="text-[10px] uppercase tracking-widest font-bold mt-2">Archival Cover Missing</span>
              </div>
            )}
            
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-[#1A1A1A]/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl border border-white/10">
                <Sparkle size={12} weight="fill" className="text-yellow-400" />
                {book.vibeScore}%
              </div>
            </div>
          </div>

          {/* Front Text Content */}
          <div className="p-5 md:p-6 flex flex-col flex-grow bg-white relative">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#4A5D4E] uppercase truncate max-w-[70%]">
                {book.genre || "General"}
              </span>
              <button
                onClick={toggleSave}
                className={cn(
                  "p-2 rounded-lg transition-all border shrink-0",
                  isSaved 
                    ? "bg-[#8C6A5E] text-white border-[#8C6A5E] shadow-lg scale-110" 
                    : "bg-[#1A1A1A]/5 text-[#1A1A1A]/40 border-transparent hover:bg-[#1A1A1A]/10 hover:text-[#1A1A1A]"
                )}
                title={isSaved ? "Remove from Study" : "Save to Study"}
              >
                <Bookmark size={16} weight={isSaved ? "fill" : "bold"} />
              </button>
            </div>
            
            <div className="space-y-1 mb-4 flex-grow overflow-hidden">
              <h3 className="font-serif text-lg md:text-xl font-bold text-[#1A1A1A] leading-[1.2] line-clamp-2">
                {book.title}
              </h3>
              <p className="text-sm text-[#1A1A1A]/50 font-medium italic truncate">
                {book.author}
              </p>
            </div>
            
            <div className="pt-4 border-t border-[#1A1A1A]/5 flex items-center justify-between mt-auto">
              <span className="text-[9px] font-bold text-[#1A1A1A]/25 uppercase tracking-[0.15em]">Summoned Volume</span>
              <div className="flex items-center gap-2 text-[10px] font-bold text-[#4A5D4E] uppercase tracking-tighter hover:underline">
                Flip <ArrowUpRight size={14} weight="bold" />
              </div>
            </div>
          </div>
        </div>

        {/* BACK: The Summary */}
        <div 
          className="absolute inset-0 rounded-2xl bg-[#F5F2ED] border border-[#1A1A1A]/10 p-6 md:p-8 flex flex-col overflow-hidden"
          style={{ 
            backfaceVisibility: "hidden", 
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            backgroundImage: "radial-gradient(circle at top right, rgba(74, 93, 78, 0.05) 0%, transparent 70%)"
          }}
        >
          <div className="flex items-center gap-2 mb-6 opacity-30 shrink-0">
            <Quotes size={24} weight="fill" className="text-[#4A5D4E]" />
            <div className="h-px flex-grow bg-[#1A1A1A]/10" />
          </div>

          <div className="mb-6 shrink-0">
            <p className="text-sm font-serif italic text-[#4A5D4E] leading-relaxed line-clamp-3">
              "{book.reasoning}"
            </p>
          </div>

          <div className="h-px w-8 bg-[#1A1A1A]/10 mb-6 shrink-0" />

          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar mb-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/30 mb-3 sticky top-0 bg-[#F5F2ED]">Archival Summary</h4>
            <p className="text-xs font-sans text-[#1A1A1A]/70 leading-relaxed text-justify">
              {cleanDescription}
            </p>
          </div>

          <div className="mt-auto pt-6 border-t border-[#1A1A1A]/5 shrink-0">
            <a
              href={`https://books.google.com/books?id=${book.googleBooksId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#1A1A1A] text-white py-3 rounded-xl text-[10px] font-bold tracking-[0.1em] uppercase hover:bg-[#4A5D4E] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              View on Google Books <ArrowUpRight size={12} weight="bold" />
            </a>
            <p className="mt-4 text-[9px] text-center font-bold text-[#1A1A1A]/20 uppercase tracking-[0.2em]">Click to Flip Back</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
