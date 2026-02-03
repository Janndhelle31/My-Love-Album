"use client";
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MusicPlayerProps {
  start: boolean;
  onComplete: () => void;
}

export default function MusicPlayer({ start, onComplete }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [count, setCount] = useState(3);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const constraintsRef = useRef(null);

  useEffect(() => {
    if (start) setShowCountdown(true);
  }, [start]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showCountdown && count > 0) {
      timer = setTimeout(() => setCount(count - 1), 1000);
    } else if (showCountdown && count === 0) {
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log("Audio blocked"));
        setIsPlaying(true);
      }
      timer = setTimeout(() => {
        setShowCountdown(false);
        onComplete();
      }, 800);
    }
    return () => clearTimeout(timer);
  }, [showCountdown, count, onComplete]);

  const togglePlay = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent toggle if the user was just finishing a drag
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/music/bg-track.mp3" loop />
      
      <AnimatePresence>
        {showCountdown && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-[#FFFBF0] flex items-center justify-center"
          >
            <motion.span 
              key={count}
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="font-serif text-8xl md:text-[12rem] text-yellow-500"
            >
              {count === 0 ? "☀️" : count}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-[100]" />

      <AnimatePresence>
        {start && !showCountdown && (
          <motion.div 
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            dragMomentum={false}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileDrag={{ scale: 1.05 }}
            /* Added touch-none to improve mobile dragging */
            className="fixed bottom-6 left-6 z-[101] pointer-events-auto cursor-grab active:cursor-grabbing touch-none"
          >
            <motion.div
              onClick={togglePlay}
              /* Responsive sizing: w-32/h-14 on mobile, w-48/h-20 on desktop */
              className="relative w-32 h-14 md:w-48 md:h-20 bg-gradient-to-b from-blue-50 to-yellow-50 rounded-full border-[3px] md:border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center px-2 md:px-4 select-none"
            >
              <motion.div 
                animate={isPlaying ? { opacity: [0.3, 0.6, 0.3] } : { opacity: 0.2 }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 bg-yellow-200"
              />

              <div className="relative flex items-end justify-center gap-0.5 md:gap-1 pointer-events-none">
                {/* Person 1 - Smaller on mobile */}
                <motion.span
                  animate={isPlaying ? { y: [0, -4, 0], rotate: [0, 5, -5, 0] } : {}}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="text-2xl md:text-4xl"
                >
                  🚶‍♂️
                </motion.span>

                <motion.span
                  animate={isPlaying ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="text-[10px] md:text-sm absolute -top-1 md:-top-2"
                >
                  ❤️
                </motion.span>

                {/* Person 2 - Smaller on mobile */}
                <motion.span
                  animate={isPlaying ? { y: [0, -4, 0], rotate: [0, -5, 5, 0] } : {}}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                  className="text-2xl md:text-4xl"
                >
                  🚶‍♀️
                </motion.span>

                {isPlaying && [1, 2].map((i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, x: 0, y: 0 }}
                    animate={{ opacity: 1, x: -20, y: -15 }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.5 }}
                    className="absolute right-0 text-yellow-600 text-[10px] md:text-sm"
                  >
                    ♫
                  </motion.span>
                ))}
              </div>

              {/* Status Indicator - Hidden on very small screens if needed, or just tiny */}
              <div className="absolute bottom-0.5 md:bottom-1 w-full text-center pointer-events-none">
                <span className="font-handwriting text-[8px] md:text-[10px] uppercase tracking-tighter md:tracking-widest text-gray-400">
                  {isPlaying ? "Sunshine" : "Paused"}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}