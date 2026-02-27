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
  const { isMidnight, addFavorite, removeFavorite, isFavorite } = useLuminaStore();
  const cleanDescription = cleanHtml(book.description);
  
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
    <div className="group perspective-1000 h-[540px] w-full" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ duration: 0.7, ease: "easeInOut" }} style={{ transformStyle: "preserve-3d" }} className="relative w-full h-full cursor-pointer shadow-2xl rounded-2xl">
        {/* FRONT */}
        <div className={cn("absolute inset-0 rounded-2xl overflow-hidden flex flex-col border transition-colors duration-1000", isMidnight ? "bg-slate-900 border-white/5" : "bg-white border-[#1A1A1A]/10")} style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
          <div className={cn("relative h-[55%] w-full overflow-hidden border-b transition-colors duration-1000", isMidnight ? "bg-slate-950 border-white/5" : "bg-[#F5F2ED] border-[#1A1A1A]/5")}>
            {book.thumbnail ? (
              <Image 
                src={book.thumbnail} 
                alt={book.title} 
                fill 
                className="object-cover transition-transform duration-700 hover:scale-105" 
                sizes="(max-width: 768px) 100vw, 20vw" 
                unoptimized
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full opacity-20"><BookOpen size={64} weight="thin" /><span className="text-[10px] mt-2 font-bold uppercase tracking-widest">No Cover</span></div>
            )}
            <div className="absolute top-4 right-4 z-10">
              <div className={cn("backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl border transition-colors duration-1000", isMidnight ? "bg-indigo-500/80 border-white/10" : "bg-[#1A1A1A]/90 border-white/10")}>
                <Sparkle size={12} weight="fill" className="text-yellow-400" /> {book.vibeScore}%
              </div>
            </div>
          </div>
          <div className={cn("p-5 md:p-6 flex flex-col flex-grow relative transition-colors duration-1000", isMidnight ? "bg-slate-900" : "bg-white")}>
            <div className="flex justify-between items-center mb-4">
              <span className={cn("text-[10px] font-bold tracking-[0.25em] uppercase truncate max-w-[70%] transition-colors duration-1000", isMidnight ? "text-indigo-400" : "text-[#4A5D4E]")}>{book.genre || "General"}</span>
              <button onClick={toggleSave} className={cn("p-2 rounded-lg transition-all border shrink-0", isSaved ? (isMidnight ? "bg-indigo-500 text-white border-indigo-500 shadow-lg" : "bg-[#8C6A5E] text-white border-[#8C6A5E] shadow-lg") : (isMidnight ? "bg-white/5 text-white/40 border-transparent hover:bg-white/10 hover:text-white" : "bg-[#1A1A1A]/5 text-[#1A1A1A]/40 border-transparent hover:bg-[#1A1A1A]/10 hover:text-[#1A1A1A]"))}>
                <Bookmark size={16} weight={isSaved ? "fill" : "bold"} />
              </button>
            </div>
            <div className="space-y-1 mb-4 flex-grow overflow-hidden text-left">
              <h3 className={cn("font-serif text-lg md:text-xl font-bold leading-[1.2] line-clamp-2 transition-colors duration-1000", isMidnight ? "text-white" : "text-[#1A1A1A]")}>{book.title}</h3>
              <p className={cn("text-sm font-medium italic truncate transition-colors duration-1000", isMidnight ? "text-white/40" : "text-[#1A1A1A]/50")}>{book.author}</p>
            </div>
            <div className={cn("pt-4 border-t flex items-center justify-between mt-auto transition-colors duration-1000", isMidnight ? "border-white/5" : "border-[#1A1A1A]/5")}>
              <span className={cn("text-[9px] font-bold uppercase tracking-[0.15em] transition-colors duration-1000", isMidnight ? "text-white/10" : "text-[#1A1A1A]/25")}>Summoned Volume</span>
              <div className={cn("flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter transition-colors duration-1000", isMidnight ? "text-indigo-400" : "text-[#4A5D4E]")}>Flip <ArrowUpRight size={14} weight="bold" /></div>
            </div>
          </div>
        </div>
        {/* BACK */}
        <div className={cn("absolute inset-0 rounded-2xl border p-6 md:p-8 flex flex-col overflow-hidden transition-all duration-1000", isMidnight ? "bg-slate-950 border-white/5 shadow-indigo-900/20" : "bg-[#F5F2ED] border-[#1A1A1A]/10 shadow-black/15")} style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", backgroundImage: isMidnight ? "radial-gradient(circle at top right, rgba(99, 102, 241, 0.05) 0%, transparent 70%)" : "radial-gradient(circle at top right, rgba(74, 93, 78, 0.05) 0%, transparent 70%)" }}>
          <div className={cn("flex items-center gap-2 mb-6 opacity-30 shrink-0")}>
            <Quotes size={24} weight="fill" className={isMidnight ? "text-indigo-400" : "text-[#4A5D4E]"} />
            <div className={cn("h-px flex-grow", isMidnight ? "bg-white/10" : "bg-[#1A1A1A]/10")} />
          </div>
          <div className="mb-6 shrink-0 text-left"><p className={cn("text-sm font-serif italic leading-relaxed line-clamp-3 transition-colors duration-1000", isMidnight ? "text-indigo-200" : "text-[#4A5D4E]")}>"{book.reasoning}"</p></div>
          <div className={cn("h-px w-8 mb-6 shrink-0", isMidnight ? "bg-white/10" : "bg-[#1A1A1A]/10")} />
          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar mb-6 text-left">
            <h4 className={cn("text-[10px] font-bold uppercase tracking-[0.2em] mb-3 sticky top-0 py-1 transition-colors duration-1000", isMidnight ? "text-white/20 bg-slate-950" : "text-[#1A1A1A]/30 bg-[#F5F2ED]")}>Archival Summary</h4>
            <p className={cn("text-xs font-sans leading-relaxed transition-colors duration-1000", isMidnight ? "text-white/60" : "text-[#1A1A1A]/70")}>{cleanDescription}</p>
          </div>
          <div className={cn("mt-auto pt-6 border-t shrink-0 flex flex-col items-center transition-colors duration-1000", isMidnight ? "border-white/5" : "border-[#1A1A1A]/5")}>
            {book.googleBooksId && (
              <a href={`https://books.google.com/books?id=${book.googleBooksId}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={cn("inline-flex items-center justify-center gap-2 h-9 rounded-lg px-4 text-[8px] font-bold tracking-[0.2em] uppercase transition-all shadow-sm active:scale-[0.98] w-full md:w-auto min-w-[160px]", isMidnight ? "bg-indigo-500 text-white hover:bg-indigo-600" : "bg-[#1A1A1A] text-white hover:bg-[#4A5D4E]")}>
                <span className="whitespace-nowrap">View Archive</span><ArrowUpRight size={10} weight="bold" className="shrink-0" />
              </a>
            )}
            <p className={cn("mt-4 text-[8px] text-center font-bold uppercase tracking-[0.25em] transition-colors duration-1000", isMidnight ? "text-white/10" : "text-[#1A1A1A]/20")}>Click to Flip Back</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
