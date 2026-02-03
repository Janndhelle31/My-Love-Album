"use client";
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import { categories } from '@/lib/data';
import Hearts from '@/components/Hearts';
import Countdown from '@/components/Countdown';
import LetterModal from '@/components/LetterModal';
import MusicPlayer from '@/components/MusicPlayer';

const polaroids = [
  { id: 1, src: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=300", top: "5%", left: "5%", rotate: -15, speed: 0.1 },
  { id: 2, src: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=300", top: "10%", left: "85%", rotate: 12, speed: 0.2 },
  { id: 3, src: "https://images.unsplash.com/photo-1516589174184-c685265142ec?w=300", top: "65%", left: "5%", rotate: 8, speed: 0.15 },
  { id: 4, src: "https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=300", top: "80%", left: "80%", rotate: -10, speed: 0.25 },
  { id: 10, src: "https://images.unsplash.com/photo-1520854221257-1745133e1ef1?w=300", top: "60%", left: "70%", rotate: 20, speed: 0.22 },
];

export default function Home() {
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const { scrollY } = useScroll();
  
  const scaleX = useSpring(useTransform(scrollY, [0, 2000], [0, 1]), {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning, Love";
    if (hour < 18) return "Good Afternoon, Love";
    return "Good Evening, Love";
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center py-12 md:py-20 px-4 md:px-6 overflow-x-hidden bg-[#FFFBF0] selection:bg-pink-200">
      
      {/* 1. PROGRESS BAR (Thinner on mobile) */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 md:h-2 bg-gradient-to-r from-pink-200 via-[#FF85A1] to-pink-200 origin-left z-50 shadow-sm" style={{ scaleX }} />
      
      {/* MUSIC PLAYER - Positioned for thumb-reach on mobile */}
      <div className="fixed bottom-6 right-6 md:top-6 md:right-6 md:bottom-auto z-50 scale-90 md:scale-100">
         <MusicPlayer start={false} onComplete={function (): void {
          throw new Error('Function not implemented.');
        } } />
      </div>

      {/* 2. BACKGROUND LAYER - Reduced opacity and count on mobile for performance */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {polaroids.map((p, idx) => {
          const y = useTransform(scrollY, [0, 1000], [0, 1000 * p.speed]);
          return (
            <motion.div
              key={p.id}
              style={{ top: p.top, left: p.left, rotate: `${p.rotate}deg`, y }}
              initial={{ opacity: 0 }}
              animate={{ opacity: idx > 2 ? 0.05 : 0.15 }} // Hide some on mobile via CSS if needed
              className={`absolute w-24 md:w-56 bg-white p-1.5 pb-6 md:pb-10 shadow-xl border border-gray-100 ${idx > 2 ? 'hidden sm:block' : 'block'}`}
            >
              <div className="w-full h-full bg-gray-100 overflow-hidden relative">
                <img src={p.src} alt="" className="w-full h-full object-cover grayscale-[40%]" />
              </div>
            </motion.div>
          );
        })}
        <div className="absolute top-1/4 left-1/3 w-32 md:w-64 h-32 md:h-64 bg-pink-200/20 blur-[60px] md:blur-[100px] rounded-full animate-pulse" />
      </div>

      <Hearts />
      
      {/* 3. MAIN CONTENT */}
      <div className="z-10 text-center max-w-7xl w-full">
        <header className="mb-12 md:mb-24 relative pt-8 md:pt-0">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-pink-200 bg-white/50 backdrop-blur-sm text-pink-400 text-[10px] md:text-xs font-bold tracking-[0.2em] mb-4 md:mb-6 uppercase"
            >
              {getGreeting()}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-6xl sm:text-7xl md:text-9xl lg:text-[11rem] font-serif text-[#FF85A1] mb-4 md:mb-8 leading-tight md:leading-none drop-shadow-sm select-none"
            >
              Our Story
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-2 md:gap-4 text-gray-400 mb-8 md:mb-12"
            >
              <div className="h-[1px] w-8 md:w-12 bg-gray-200" />
              <span className="font-handwriting text-2xl md:text-3xl text-gray-500 italic">Since 2022</span>
              <div className="h-[1px] w-8 md:w-12 bg-gray-200" />
            </motion.div>
        </header>
        
        {/* Countdown - Adjusted for mobile sizing inside the component usually, but we wrap it here too */}
        <div className="mb-16 md:mb-24 transform scale-90 sm:scale-100">
          <Countdown />
        </div>

        {/* 4. GRID - 1 column on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 px-2 md:px-4">
          {categories.map((cat, idx) => (
            <Link href={`/album/${cat.id}`} key={cat.id} className="group">
              <motion.div 
                whileHover={{ y: -8 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.4, delay: (idx % 4) * 0.05 }}
                className="relative bg-white/70 backdrop-blur-xl h-full p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-sm border border-white/50 group-hover:bg-white/95 group-hover:shadow-xl group-hover:shadow-pink-200/30 transition-all duration-300 overflow-hidden"
              >
                <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="text-5xl md:text-6xl mb-4 md:mb-8 transform group-hover:scale-110 group-hover:rotate-6 transition-transform">
                    {cat.icon}
                  </div>
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-800 mb-2">{cat.title}</h2>
                  <p className="text-gray-500 font-handwriting text-lg md:text-xl leading-snug">
                    {cat.description}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* 5. TIMELINE - Simplified for mobile */}
        <section className="mt-32 md:mt-56 relative py-12 md:py-20 overflow-hidden">
            <div className="absolute inset-0 bg-pink-50/30 -skew-y-1 md:-skew-y-2 z-0" />
            <div className="relative z-10 max-w-3xl mx-auto px-6">
                <h3 className="font-serif text-3xl md:text-5xl text-gray-800 mb-12 md:mb-20">The Journey So Far</h3>
                <div className="space-y-10 md:space-y-16 border-l-2 border-pink-200 pl-6 md:pl-10 ml-2 text-left">
                    {[
                        { date: "June 14, 2022", event: "The moment that changed everything", emoji: "✨" },
                        { date: "August 2023", event: "Our first big flight", emoji: "✈️" },
                        { date: "Today", event: "Still falling for you", emoji: "❤️" }
                    ].map((milestone, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="absolute -left-[35px] md:-left-[53px] top-1.5 w-4 h-4 md:w-6 md:h-6 rounded-full bg-white border-2 md:border-4 border-pink-400" />
                            <span className="text-[10px] md:text-xs font-black text-pink-400 uppercase tracking-widest">{milestone.date}</span>
                            <p className="text-xl md:text-3xl font-handwriting text-gray-700 mt-1">{milestone.event} {milestone.emoji}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {/* 6. SECRET LETTER - Scaled for thumb-tap on mobile */}
        <div className="mt-24 md:mt-48 pb-20 md:pb-32 px-4">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsLetterOpen(true)} 
            className="relative group p-8 md:p-12 w-full md:w-auto"
          >
            <div className="absolute inset-0 bg-pink-200/40 rounded-full blur-2xl md:blur-3xl" />
            <div className="relative flex flex-col items-center cursor-pointer">
              <span className="text-[#FF85A1] font-handwriting text-2xl md:text-4xl mb-4 md:mb-6 text-center">
                Wait, I have a secret message...
              </span>
              <div className="text-6xl md:text-[100px] animate-bounce">
                💌
              </div>
            </div>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isLetterOpen && <LetterModal onClose={() => setIsLetterOpen(false)} />}
      </AnimatePresence>

      <footer className="z-10 py-8 md:py-12 flex flex-col items-center gap-2 border-t border-pink-100 w-full max-w-4xl opacity-60">
        <div className="text-lg md:text-2xl font-serif text-pink-400 italic">Forever & Always</div>
        <div className="text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.4em] uppercase text-gray-400 text-center px-4">
           Designed with love for you • {new Date().getFullYear()}
        </div>
      </footer>
    </main>
  );
}