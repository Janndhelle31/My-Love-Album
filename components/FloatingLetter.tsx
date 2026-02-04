"use client";
import { motion, AnimatePresence } from "framer-motion";

interface LetterProps {
  id: number;
  message: string;
  isOpen: boolean;
  isFallen: boolean;
  onClick: () => void;
  onClose: () => void;
}

export default function FloatingLetter({ id, message, isOpen, isFallen, onClick, onClose }: LetterProps) {
  // Spread letters across the screen randomly
  const startX = (id * 13) % 80 + 10; 
  const startY = (id * 7) % 50 + 15;

  return (
    <>
      <motion.div
        initial={{ top: `${startY}%`, left: `${startX}%` }}
        animate={
          isOpen
            ? { top: "50%", left: "50%", x: "-50%", y: "-50%", scale: 1.1, zIndex: 100, rotate: 0 }
            : isFallen
            ? { top: "92%", x: 0, y: 0, scale: 0.8, rotate: id % 2 === 0 ? 10 : -10, zIndex: 10 }
            : {
                x: [0, 25, -25, 0],
                y: [0, -40, 40, 0],
                rotate: [0, 8, -8, 0],
                transition: {
                  duration: 7 + (id % 3),
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }
        }
        className="fixed cursor-pointer pointer-events-auto"
        onClick={!isOpen ? onClick : undefined}
      >
        <div className={`relative w-20 h-14 md:w-28 md:h-20 flex items-center justify-center rounded shadow-lg border-2 
          ${isFallen ? "bg-stone-100 border-stone-200 opacity-60" : "bg-white border-yellow-100 hover:scale-110 transition-transform"}`}>
          <span className="text-2xl md:text-3xl">{isFallen ? "✉️" : "💌"}</span>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-[#FFFBF0] p-8 w-full max-w-sm shadow-2xl border-b-4 border-yellow-400 text-center rounded-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="font-handwriting text-2xl md:text-3xl text-gray-800 leading-relaxed mb-6">
                {message}
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-pink-400 text-white rounded-full font-serif text-sm hover:bg-pink-500 transition-all"
              >
                Close & Let Fall ↓
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}