"use client";
import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform, useScroll } from 'framer-motion';
import Polaroid from '@/components/Polaroid';
import { memories, categories } from '@/lib/data';
import Hearts from '@/components/Hearts';

// --- PARALLAX SCATTERED BACKGROUND ---
const ScatteredBackground = ({ photos }: { photos: any[] }) => {
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  
  useEffect(() => { setMounted(true); }, []);

  const backgroundItems = useMemo(() => {
    return [...photos, ...photos].slice(0, 12).map((p, i) => ({
      ...p,
      top: `${(i * 25 + 10) % 90}%`,
      left: `${(i * 17 + 5) % 90}%`,
      rotation: (i * 45) % 360,
      scale: 0.5 + ((i * 7) % 30) / 100,
      speed: 0.1 + (i % 3) * 0.1 
    }));
  }, [photos]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-25 select-none z-0">
      <div className="relative w-full h-full blur-[2px]">
        {backgroundItems.map((p, i) => (
          <BackgroundItem key={`bg-${i}`} item={p} scrollY={scrollY} />
        ))}
      </div>
    </div>
  );
};

const BackgroundItem = ({ item, scrollY }: any) => {
  const y = useTransform(scrollY, [0, 2000], [0, -200 * item.speed]);
  return (
    <motion.div className="absolute" style={{ top: item.top, left: item.left, y }}>
      <div style={{ transform: `rotate(${item.rotation}deg) scale(${item.scale})` }}>
        <Polaroid image={item.img} date="" note="" rotation={0} />
      </div>
    </motion.div>
  );
};

export default function AlbumPage() {
  const params = useParams();
  const categoryId = params.category as string;
  
  // --- STATE ---
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(3); 
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  const currentCategory = categories.find(c => c.id === categoryId);
  const photos = memories[categoryId] || [];

  // --- IMAGE PRELOADER ---
  useEffect(() => {
    if (photos.length === 0) {
      setIsLoading(false);
      return;
    }

    let loadedCount = 0;
    const totalPhotos = photos.length;

    photos.forEach((photo) => {
      const img = new Image();
      img.src = photo.img;
      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.floor((loadedCount / totalPhotos) * 100));
        if (loadedCount === totalPhotos) {
          // Add a small delay for a smoother "reveal"
          setTimeout(() => setIsLoading(false), 1000);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === totalPhotos) setIsLoading(false);
      };
    });
  }, [photos]);

  // --- ANIMATION VALUES ---
  const dragX = useMotionValue(0);
  const rotateWheel = useTransform(dragX, [-250, 250], [-30, 30]);
  const verticalSlope = useTransform(dragX, [-250, 0, 250], [60, 0, 60]);
  const opacityWheel = useTransform(dragX, [-300, -200, 0, 200, 300], [0, 0.5, 1, 0.5, 0]);

  const nextPhoto = () => { if (selectedIndex !== null) setSelectedIndex((selectedIndex + 1) % photos.length); };
  const prevPhoto = () => { if (selectedIndex !== null) setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length); };

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -80 || info.velocity.x < -500) nextPhoto();
    else if (info.offset.x > 80 || info.velocity.x > 500) prevPhoto();
  };

  if (!currentCategory) return null;

  return (
    <main className="min-h-screen bg-[#FFFBF0] p-4 md:p-12 overflow-x-hidden relative selection:bg-pink-200">
      
      {/* 1. CUTIE LOADING SCREEN */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-[#FFFBF0] flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-6xl mb-6"
            >
              ✨💖✨
            </motion.div>
            <h2 className="font-handwriting text-3xl text-pink-500 animate-pulse">
              Developing our memories...
            </h2>
            <div className="w-48 h-1 bg-pink-100 rounded-full mt-6 overflow-hidden relative">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-pink-400"
                initial={{ width: 0 }}
                animate={{ width: `${loadProgress}%` }}
                transition={{ type: "spring", stiffness: 50 }}
              />
            </div>
            <p className="mt-3 text-pink-300 text-[10px] tracking-[0.3em] uppercase font-bold">
              {loadProgress}% Loaded
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <Hearts />
      <ScatteredBackground photos={photos} />

      {/* 2. LIGHTBOX / MODAL VIEW */}
      <AnimatePresence mode="wait">
        {selectedIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 overflow-hidden"
          >
            <motion.div 
              key={`bg-blur-${photos[selectedIndex].id}`}
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1.1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 z-0 bg-cover bg-center filter blur-[60px] brightness-[0.85]"
              style={{ backgroundImage: `url(${photos[selectedIndex].img})` }}
            />
            <div className="absolute inset-0 bg-white/30 backdrop-blur-md z-[1]" />

            <button 
              onClick={() => setSelectedIndex(null)} 
              className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-pink-600 text-3xl font-light hover:bg-white/40 transition-all z-[60] border border-white/50"
            >
              ×
            </button>

            <div className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-10 md:gap-16 z-10">
              <div className="relative w-full md:w-3/5 flex justify-center items-center h-[350px] md:h-[600px]">
                <motion.div 
                  key={`photo-${photos[selectedIndex].id}`}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  style={{ x: dragX, rotate: rotateWheel, y: verticalSlope, opacity: opacityWheel }}
                  onDragEnd={handleDragEnd}
                  initial={{ scale: 0.5, opacity: 0, x: 200 }}
                  animate={{ scale: 1, opacity: 1, x: 0 }}
                  exit={{ scale: 0.5, opacity: 0, x: -200 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="absolute cursor-grab active:cursor-grabbing touch-none drop-shadow-2xl"
                >
                  <div className="scale-[0.85] md:scale-110">
                    <Polaroid image={photos[selectedIndex].img} date={photos[selectedIndex].date} note="" rotation={0} />
                  </div>
                </motion.div>
              </div>

              <motion.div 
                key={`content-${photos[selectedIndex].id}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full md:w-2/5 flex flex-col items-center md:items-start text-center md:text-left space-y-6"
              >
                <div className="space-y-2">
                  <span className="inline-block text-pink-700 font-serif text-xs md:text-sm uppercase tracking-[0.3em] bg-white/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/40 shadow-sm">
                    {currentCategory.title}
                  </span>
                  <h2 className="text-4xl md:text-6xl font-serif text-gray-900 leading-tight">
                    {photos[selectedIndex].date}
                  </h2>
                </div>

                <div className="relative">
                  <p className="font-handwriting text-3xl md:text-4xl text-pink-600 leading-relaxed italic drop-shadow-sm">
                    "{photos[selectedIndex].note || "Every second spent with you is a second I cherish forever."}"
                  </p>
                </div>

                <div className="flex flex-col items-center md:items-start gap-4 pt-4">
                  <div className="flex gap-2.5">
                    {photos.map((_, i) => (
                      <motion.div
                        key={`dot-${i}`}
                        animate={{ 
                          width: i === selectedIndex ? 24 : 8,
                          backgroundColor: i === selectedIndex ? "#db2777" : "#fbcfe8"
                        }}
                        className="h-2 rounded-full shadow-inner transition-all duration-300"
                      />
                    ))}
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-pink-400 font-bold animate-pulse">
                    Swipe photo to explore
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. MAIN GALLERY CONTENT */}
      <motion.div 
        className={`max-w-6xl mx-auto z-10 transition-all duration-1000 ease-in-out 
          ${selectedIndex !== null ? 'blur-3xl scale-95 opacity-0' : 'opacity-100'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
      >
        <nav className="mb-12">
          <Link href="/" className="inline-flex items-center group font-handwriting text-2xl text-pink-400 hover:text-pink-600 transition-all">
            <span className="mr-2 group-hover:-translate-x-2 transition-transform">←</span> Return Library
          </Link>
        </nav>

        <header className="text-center mb-16 space-y-2">
          <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ opacity: 1, scale: 1 }} className="text-4xl block drop-shadow-sm mb-2">
            {currentCategory.icon}
          </motion.span>
          <h1 className="text-4xl md:text-6xl font-serif text-gray-800 tracking-tight">{currentCategory.title}</h1>
          <p className="font-handwriting text-xl md:text-2xl text-pink-400 italic max-w-xl mx-auto px-6 opacity-90">{currentCategory.description}</p>
          <div className="flex justify-center pt-4">
            <div className="h-[1px] w-12 bg-pink-200" />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 justify-items-center">
          {photos.slice(0, visibleCount).map((p, index) => (
            <motion.div 
              key={p.id} 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -15, scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }} 
              onClick={() => setSelectedIndex(index)} 
              className="cursor-pointer transition-all duration-500"
            >
              <Polaroid image={p.img} date={p.date} note={p.note} rotation={p.rot} />
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {visibleCount < photos.length && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col items-center justify-center mt-24 pb-32"
            >
              <button 
                onClick={() => setVisibleCount(prev => prev + 3)}
                className="group flex flex-col items-center gap-3 transition-all hover:scale-105"
              >
                <div className="w-16 h-[1px] bg-pink-200 group-hover:w-24 transition-all duration-500" />
                <span className="font-handwriting text-3xl text-pink-400 group-hover:text-pink-600 transition-colors">
                  See more memories...
                </span>
                <motion.span 
                  animate={{ y: [0, 5, 0] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-2xl"
                >
                  ✨
                </motion.span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}