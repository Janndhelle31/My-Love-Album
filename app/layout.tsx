"use client";
import { useState } from "react";
import { Playfair_Display, Caveat } from "next/font/google";
import "./globals.css";
import MusicPlayer from "@/components/MusicPlayer";
import { motion, AnimatePresence } from "framer-motion";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

// Background memories that will appear everywhere
const polaroids = [
  { id: 1, src: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=300", top: "5%", left: "5%", rotate: -15 },
  { id: 2, src: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=300", top: "10%", left: "85%", rotate: 12 },
  { id: 3, src: "https://images.unsplash.com/photo-1516589174184-c685265142ec?w=300", top: "65%", left: "5%", rotate: 8 },
  { id: 4, src: "https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=300", top: "80%", left: "80%", rotate: -10 },
  { id: 5, src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300", top: "40%", left: "90%", rotate: -20 },
  { id: 6, src: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=300", top: "2%", left: "45%", rotate: 5 },
  { id: 7, src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300", top: "45%", left: "-2%", rotate: -8 },
  { id: 8, src: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300", top: "85%", left: "35%", rotate: 15 },
  { id: 9, src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300", top: "25%", left: "15%", rotate: -12 },
  { id: 10, src: "https://images.unsplash.com/photo-1520854221257-1745133e1ef1?w=300", top: "60%", left: "70%", rotate: 20 },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isEntryClicked, setIsEntryClicked] = useState(false);
  const [showContent, setShowContent] = useState(false);

  return (
    <html lang="en">
      <body className={`${playfair.variable} ${caveat.variable} font-serif bg-[#FFFBF0] antialiased`}>
        
        {/* 1. SCATTERED BACKGROUND (Fixed so it doesn't move) */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          {polaroids.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={showContent ? { opacity: 0.35, scale: 1 } : { opacity: 0 }}
              transition={{ duration: 1.5, delay: p.id * 0.1 }}
              className="absolute w-32 md:w-48 bg-white p-2 pb-8 shadow-lg border border-gray-100"
              style={{ 
                top: p.top, 
                left: p.left, 
                rotate: `${p.rotate}deg`,
                filter: "blur(2px)" 
              }}
            >
              <div className="w-full h-full bg-gray-50 overflow-hidden">
                <img src={p.src} alt="" className="w-full h-full object-cover grayscale-[20%]" />
              </div>
            </motion.div>
          ))}
          {/* Subtle overlay to keep everything behind a warm tint */}
          <div className="absolute inset-0 bg-[#FFFBF0]/30 backdrop-blur-[1px]" />
        </div>

        {/* 2. MUSIC & COUNTDOWN LOGIC */}
        <MusicPlayer 
          start={isEntryClicked} 
          onComplete={() => setShowContent(true)} 
        />

        {/* 3. INITIAL COVER SCREEN */}
        <AnimatePresence>
          {!isEntryClicked && (
            <motion.div 
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[400] bg-[#FFFBF0] flex flex-col items-center justify-center p-6 text-center"
            >
              <h1 className="font-serif text-5xl md:text-7xl text-gray-800 mb-4">
                For My Favorite Person
              </h1>
              <p className="font-handwriting text-3xl text-pink-400 mb-10">
                A collection of our sunshine moments
              </p>
              <button 
                onClick={() => setIsEntryClicked(true)}
                className="px-10 py-4 bg-yellow-400 text-white rounded-full font-serif text-xl shadow-xl hover:bg-yellow-500 transition-all hover:scale-110 active:scale-95"
              >
                Open Memory Book 🎁
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. ACTUAL CONTENT (Children + Main Layout) */}
        <main className={`relative z-10 transition-opacity duration-1000 ${showContent ? "opacity-100" : "opacity-0"}`}>
          {children}
        </main>

      </body>
    </html>
  );
}