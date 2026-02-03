"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  image: string;
  note: string;
  date: string;
  rotation: number;
}

export default function Polaroid({ image, note, date, rotation }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative w-72 h-96 perspective-1000 m-6">
      <motion.div
        className="relative w-full h-full cursor-pointer preserve-3d"
        // We handle the tilt (rotation) separately from the flip (rotateY)
        initial={{ rotateZ: rotation }}
        animate={{ 
          rotateY: isFlipped ? 180 : 0,
          rotateZ: isFlipped ? 0 : rotation, // Straighten up when reading the note
        }}
        whileHover={{ 
          scale: 1.05, 
          rotateZ: 0,
          zIndex: 50,
          transition: { duration: 0.3 } 
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20 
        }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* FRONT: The Photo */}
        <div className="absolute inset-0 bg-white p-4 pb-12 shadow-[0_10px_30px_rgba(0,0,0,0.15)] rounded-sm backface-hidden border border-gray-100">
          <div className="w-full h-[85%] bg-gray-100 overflow-hidden relative group">
            <img 
              src={image} 
              alt="Memory" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
            {/* Glossy overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50" />
          </div>
          <p className="mt-6 text-center font-handwriting text-3xl text-gray-800 tracking-tight">
            {date}
          </p>
        </div>

        {/* BACK: The Message */}
        <div 
          className="absolute inset-0 bg-[#FFF9F9] p-8 shadow-2xl rounded-sm backface-hidden flex flex-col items-center justify-center border-2 border-[#FFC1CC]"
          style={{ transform: "rotateY(180deg)" }}
        >
          {/* Decorative stamp in corner */}
          <div className="absolute top-4 right-4 text-2xl opacity-20">📮</div>
          
          <div className="flex-1 flex items-center justify-center">
            <p className="text-center font-handwriting text-2xl md:text-3xl text-pink-700 leading-relaxed italic">
              {note}
            </p>
          </div>
          
          <div className="mt-4 flex flex-col items-center">
            <div className="h-px w-12 bg-pink-200 mb-2" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-pink-300 font-sans">
              Tap to Flip
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}