"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkle, Info, ArrowUpRight, BookOpen, Quotes } from "@phosphor-icons/react";
import { cleanHtml, truncate } from "@/lib/utils";
import Image from "next/image";
import { type BookRecommendation } from "@/app/actions";
import { cn } from "@/lib/utils";

export function BookCard({ book, delay = 0 }: { book: BookRecommendation; delay?: number }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cleanDescription = cleanHtml(book.description);

  return (
    <div 
      className="group perspective-1000 h-[500px] w-full"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
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
          {/* Cover Image */}
          <div className="relative h-[65%] w-full bg-[#F5F2ED] overflow-hidden">
            {book.thumbnail ? (
              <Image
                src={book.thumbnail}
                alt={book.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 20vw"
                priority
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-[#1A1A1A]/20">
                <BookOpen size={64} weight="thin" />
                <span className="text-[10px] uppercase tracking-widest font-bold mt-2">No Archival Cover</span>
              </div>
            )}
            
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-[#1A1A1A] text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xl">
                <Sparkle size={12} weight="fill" className="text-yellow-400" />
                {book.vibeScore}%
              </div>
            </div>
          </div>

          {/* Front Text */}
          <div className="p-6 flex flex-col flex-grow bg-white">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#4A5D4E] uppercase mb-2">
              {book.genre}
            </span>
            <h3 className="font-serif text-lg font-bold text-[#1A1A1A] leading-tight line-clamp-2 mb-1">
              {book.title}
            </h3>
            <p className="text-sm text-[#1A1A1A]/40 font-medium italic mb-4">
              {book.author}
            </p>
            
            <div className="mt-auto pt-4 border-t border-[#1A1A1A]/5 flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#1A1A1A]/20 uppercase tracking-widest">Flip for summary</span>
              <ArrowUpRight size={14} className="text-[#1A1A1A]/20" />
            </div>
          </div>
        </div>

        {/* BACK: The Summary */}
        <div 
          className="absolute inset-0 rounded-2xl bg-[#F5F2ED] border border-[#1A1A1A]/10 p-8 flex flex-col overflow-hidden"
          style={{ 
            backfaceVisibility: "hidden", 
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            backgroundImage: "radial-gradient(circle at top right, rgba(74, 93, 78, 0.05) 0%, transparent 70%)"
          }}
        >
          <div className="flex items-center gap-2 mb-6 opacity-30">
            <Quotes size={24} weight="fill" className="text-[#4A5D4E]" />
            <div className="h-px flex-grow bg-[#1A1A1A]/10" />
          </div>

          <div className="mb-6">
            <p className="text-sm font-serif italic text-[#4A5D4E] leading-relaxed">
              "{book.reasoning}"
            </p>
          </div>

          <div className="h-px w-8 bg-[#1A1A1A]/10 mb-6" />

          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/30 mb-3">Archival Summary</h4>
            <p className="text-xs font-sans text-[#1A1A1A]/70 leading-relaxed text-justify">
              {cleanDescription}
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-[#1A1A1A]/5">
            <a
              href={`https://books.google.com/books?id=${book.googleBooksId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#1A1A1A] text-white py-3 rounded-xl text-[10px] font-bold tracking-[0.1em] uppercase hover:bg-[#4A5D4E] transition-colors"
            >
              View on Google Books <ArrowUpRight size={12} weight="bold" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
