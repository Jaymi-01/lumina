"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkle, Info, ArrowUpRight, BookOpen, Quotes, Bookmark } from "@phosphor-icons/react";
import { cleanHtml, truncate } from "@/lib/utils";
import Image from "next/image";
import { type BookRecommendation } from "@/app/actions";
import { cn } from "@/lib/utils";
import { useLuminaStore } from "@/lib/store";
import { toast } from "sonner";

interface BookCardProps {
  book: BookRecommendation;
  delay?: number;
}

export function BookCard({ book, delay = 0 }: BookCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cleanDescription = cleanHtml(book.description);
  const { addFavorite, removeFavorite, isFavorite } = useLuminaStore();
  
  const isSaved = book.googleBooksId ? isFavorite(book.googleBooksId) : false;

  const toggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!book.googleBooksId) return;
    if (isSaved) {
      removeFavorite(book.googleBooksId);
      toast.info(`"${truncate(book.title, 20)}" removed.`);
    } else {
      addFavorite(book);
      toast.success(`"${truncate(book.title, 20)}" saved.`);
    }
  };

  return (
    <div 
      className="group perspective-1000 h-[540px] w-full"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full h-full cursor-pointer shadow-2xl rounded-2xl"
      >
        {/* FRONT */}
        <div 
          className="absolute inset-0 rounded-2xl overflow-hidden bg-white border border-[#1A1A1A]/10 flex flex-col"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
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
                <span className="text-[10px] mt-2 font-bold uppercase tracking-widest">No Cover</span>
              </div>
            )}
            
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-[#1A1A1A]/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl border border-white/10">
                <Sparkle size={12} weight="fill" className="text-yellow-400" />
                {book.vibeScore}%
              </div>
            </div>
          </div>

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
                    ? "bg-[#8C6A5E] text-white border-[#8C6A5E] shadow-lg" 
                    : "bg-[#1A1A1A]/5 text-[#1A1A1A]/40 border-transparent hover:bg-[#1A1A1A]/10 hover:text-[#1A1A1A]"
                )}
              >
                <Bookmark size={16} weight={isSaved ? "fill" : "bold"} />
              </button>
            </div>
            
            <div className="space-y-1 mb-4 flex-grow overflow-hidden text-left">
              <h3 className="font-serif text-lg md:text-xl font-bold text-[#1A1A1A] leading-[1.2] line-clamp-2">
                {book.title}
              </h3>
              <p className="text-sm text-[#1A1A1A]/50 font-medium italic truncate">
                {book.author}
              </p>
            </div>
            
            <div className="pt-4 border-t border-[#1A1A1A]/5 flex items-center justify-between mt-auto">
              <span className="text-[9px] font-bold text-[#1A1A1A]/25 uppercase tracking-[0.15em]">Summoned Volume</span>
              <div className="flex items-center gap-2 text-[10px] font-bold text-[#4A5D4E] uppercase tracking-tighter">
                Flip <ArrowUpRight size={14} weight="bold" />
              </div>
            </div>
          </div>
        </div>

        {/* BACK */}
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

          <div className="mb-6 shrink-0 text-left">
            <p className="text-sm font-serif italic text-[#4A5D4E] leading-relaxed line-clamp-3">
              "{book.reasoning}"
            </p>
          </div>

          <div className="h-px w-8 bg-[#1A1A1A]/10 mb-6 shrink-0" />

          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar mb-6 text-left">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/30 mb-3 bg-[#F5F2ED] sticky top-0 py-1">Archival Summary</h4>
            <p className="text-xs font-sans text-[#1A1A1A]/70 leading-relaxed">
              {cleanDescription}
            </p>
          </div>

          <div className="mt-auto pt-6 border-t border-[#1A1A1A]/5 shrink-0 flex flex-col items-center">
            {book.googleBooksId && (
              <a
                href={`https://books.google.com/books?id=${book.googleBooksId}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center justify-center gap-2 bg-[#1A1A1A] text-white h-9 rounded-lg px-4 text-[8px] font-bold tracking-[0.2em] uppercase hover:bg-[#4A5D4E] transition-all shadow-sm active:scale-[0.98] w-full md:w-auto min-w-[160px]"
              >
                <span className="whitespace-nowrap">View Archive</span>
                <ArrowUpRight size={10} weight="bold" className="shrink-0" />
              </a>
            )}
            <p className="mt-4 text-[8px] text-center font-bold text-[#1A1A1A]/20 uppercase tracking-[0.25em]">Click to Flip Back</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
