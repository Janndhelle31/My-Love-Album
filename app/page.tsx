"use client";
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { categories } from '@/lib/data';
import Hearts from '@/components/Hearts';
import Countdown from '@/components/Countdown';
import MusicPlayer from '@/components/MusicPlayer';

const polaroids = [
  { id: 1, src: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=400", top: "5%", left: "5%", rotate: -15 },
  { id: 2, src: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=400", top: "15%", left: "80%", rotate: 12 },
  { id: 3, src: "https://images.unsplash.com/photo-1516589174184-c685265142ec?w=400", top: "65%", left: "2%", rotate: 8 },
  { id: 4, src: "https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=400", top: "85%", left: "75%", rotate: -10 },
  { id: 10, src: "https://images.unsplash.com/photo-1520854221257-1745133e1ef1?w=400", top: "40%", left: "85%", rotate: 20 },
];

export default function Home() {
  const { scrollY } = useScroll();
  
  // Progress bar logic - kept at the top level
  const scaleX = useSpring(useTransform(scrollY, [0, 1500], [0, 1]), {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const getGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning, Love";
    if (hour < 18) return "Good Afternoon, Love";
    return "Good Evening, Love";
  }, []);

  return (
    <main className="relative min-h-screen flex flex-col items-center py-12 md:py-24 px-4 overflow-x-hidden bg-[#FFFBF0] selection:bg-pink-200">
      
      {/* 1. PROGRESS BAR */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-200 via-[#FF85A1] to-pink-300 origin-left z-[60] shadow-sm" 
        style={{ scaleX }} 
      />
      
      {/* FLOATING MUSIC PLAYER */}
      <div className="fixed bottom-8 right-8 z-50">
         <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <MusicPlayer start={false} onComplete={() => {}} />
         </motion.div>
      </div>

      {/* 2. STATIC ATMOSPHERIC BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {polaroids.map((p, idx) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: idx > 2 ? 0.08 : 0.2, 
              scale: 1 
            }}
            transition={{ duration: 1, delay: idx * 0.2 }}
            className={`absolute w-32 md:w-64 bg-white p-2 pb-8 md:pb-12 shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-white/50 rounded-sm transform-gpu ${idx > 2 ? 'hidden lg:block' : 'block'}`}
            style={{ 
              top: p.top, 
              left: p.left, 
              rotate: `${p.rotate}deg` 
            }}
          >
            <div className="w-full h-full bg-gray-50 overflow-hidden relative grayscale-[20%] sepia-[10%]">
              <img src={p.src} alt="" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        ))}
        {/* Soft Ambient Glows */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-pink-200/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-orange-100/30 blur-[120px] rounded-full" />
      </div>

      <Hearts />
      
      {/* 3. HERO SECTION */}
      <div className="z-10 text-center max-w-7xl w-full">
        <header className="mb-20 md:mb-32 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-pink-200 bg-white/60 backdrop-blur-md text-[#FF85A1] text-xs font-bold tracking-[0.3em] mb-8 uppercase shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
              </span>
              {getGreeting}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-7xl sm:text-8xl md:text-9xl lg:text-[12rem] font-serif text-[#FF85A1] leading-none mb-6 drop-shadow-md select-none tracking-tighter"
            >
              Our Story
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-center gap-6 text-gray-400"
            >
              <div className="h-[1px] w-12 md:w-20 bg-gradient-to-r from-transparent to-gray-300" />
              <span className="font-handwriting text-3xl md:text-4xl text-gray-500 italic">Since 2022</span>
              <div className="h-[1px] w-12 md:w-20 bg-gradient-to-l from-transparent to-gray-300" />
            </motion.div>
        </header>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-24 md:mb-40"
        >
          <Countdown />
        </motion.div>

        {/* 4. CATEGORY TILES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10 px-4 md:px-12">
          {categories.map((cat, idx) => (
            <Link href={`/album/${cat.id}`} key={cat.id} className="group">
              <motion.div 
                whileHover={{ y: -12, scale: 1.02 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative bg-white/40 backdrop-blur-xl h-full p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover:shadow-[0_20px_50px_rgba(255,133,161,0.2)] transition-all duration-500 overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-100/50 rounded-full group-hover:bg-pink-200/50 transition-colors duration-500" />
                
                <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="text-6xl md:text-7xl mb-8 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 drop-shadow-sm">
                    {cat.icon}
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-gray-800 mb-3">{cat.title}</h2>
                  <p className="text-gray-500 font-handwriting text-xl md:text-2xl leading-snug opacity-80 group-hover:opacity-100">
                    {cat.description}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      <footer className="z-10 py-16 flex flex-col items-center gap-4 border-t border-pink-100/50 w-full max-w-5xl opacity-80">
        <div className="text-2xl md:text-3xl font-serif text-[#FF85A1] italic tracking-tight">Forever & Always</div>
        <div className="text-[10px] tracking-[0.4em] uppercase text-gray-400 text-center font-bold">
           Handcrafted with love • {new Date().getFullYear()}
        </div>
      </footer>
    </main>
  );
}