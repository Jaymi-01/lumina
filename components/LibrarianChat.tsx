"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLuminaStore } from "@/lib/store";
import { askLibrarian } from "@/app/chat-actions";
import { ChatCircleDots, PaperPlaneRight, X, Sparkle } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function LibrarianChat({ contextBooks }: { contextBooks: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { chatHistory, addChatMessage } = useLuminaStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput("");
    addChatMessage({ role: "user", content: userMsg });
    setIsLoading(true);

    const response = await askLibrarian(userMsg, chatHistory, contextBooks);
    addChatMessage({ role: "librarian", content: response });
    setIsLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 bg-[#1A1A1A] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 group"
      >
        <ChatCircleDots size={28} weight="fill" />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-[#1A1A1A] text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-[#1A1A1A]/10">
          Consult the Librarian
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-8 z-50 w-[350px] h-[500px] bg-white/90 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-[#1A1A1A]/5 flex items-center justify-between bg-[#1A1A1A]/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#4A5D4E] rounded-full flex items-center justify-center text-white">
                  <Sparkle size={18} weight="fill" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">Lumina</h3>
                  <p className="text-[10px] text-[#1A1A1A]/40 font-medium">Digital Librarian</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-[#1A1A1A]/40 hover:text-[#1A1A1A]">
                <X size={20} weight="bold" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-grow overflow-y-auto p-5 space-y-4 custom-scrollbar">
              {chatHistory.length === 0 && (
                <div className="text-center py-8 opacity-40 italic text-sm">
                  "Greetings. How may I assist you with these volumes?"
                </div>
              )}
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    msg.role === "user" ? "ml-auto items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-[#1A1A1A] text-white rounded-tr-none"
                        : "bg-[#F5F2ED] text-[#1A1A1A] border border-[#1A1A1A]/5 rounded-tl-none font-serif italic"
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-1 animate-pulse p-2">
                  <div className="w-1.5 h-1.5 bg-[#4A5D4E] rounded-full" />
                  <div className="w-1.5 h-1.5 bg-[#4A5D4E] rounded-full" />
                  <div className="w-1.5 h-1.5 bg-[#4A5D4E] rounded-full" />
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-[#1A1A1A]/5 bg-[#1A1A1A]/5">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask the Librarian..."
                  className="w-full bg-white border border-[#1A1A1A]/10 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A5D4E]/20"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#4A5D4E] hover:scale-110 transition-transform disabled:opacity-30"
                >
                  <PaperPlaneRight size={20} weight="fill" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
