"use client";
import { motion } from "framer-motion";

export default function LetterModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="absolute inset-0" 
        onClick={onClose} 
      />

      <motion.div 
        initial={{ scale: 0, y: 400, rotate: -10 }}
        animate={{ scale: 1, y: 0, rotate: 0 }}
        exit={{ scale: 0, y: 400, rotate: 10 }}
        transition={{ type: "spring", damping: 15, stiffness: 100 }}
        className="relative w-full max-w-lg z-[110]"
      >
        {/* THE PAPER - Removed overflow-hidden so the polaroid can hang out */}
        <div className="bg-[#fdfdfd] p-10 md:p-14 shadow-2xl rounded-sm border-t-[12px] border-[#FF85A1] relative min-h-[400px]">
          
          {/* Lined paper effect */}
          <div className="absolute inset-0 opacity-[0.1] pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '100% 35px' }} />
          
          <button onClick={onClose} className="absolute top-4 right-4 z-50 text-gray-400 hover:text-[#FF85A1]">✕</button>

          <div className="relative z-10 mb-10">
            <h2 className="text-3xl font-serif font-bold text-[#FF85A1] mb-6 italic">My Dearest,</h2>
            
            <div className="font-handwriting text-2xl leading-[35px] text-gray-700 space-y-4">
              <p>I wanted to surprise you with this little note.</p>
              <p>Every memory we've shared is a treasure I keep close to my heart.</p>
              <p>Thank you for being my person. I love you more than words can say.</p>
              
              <div className="pt-8 text-right italic">
                <p>Forever yours,</p>
                <p className="text-[#FF85A1] text-4xl mt-2">[Your Name]</p>
              </div>
            </div>
          </div>

          {/* --- THE HANGING POLAROID STICKER --- */}
          <motion.div 
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            whileHover={{ scale: 1.1, zIndex: 50 }}
            className="absolute -bottom-16 left-10 w-32 h-40 rotate-[-8deg] cursor-grab active:cursor-grabbing"
          >
            {/* The "Tape" that holds it to the paper */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-8 bg-white/30 backdrop-blur-sm border border-white/20 shadow-sm z-30 rotate-[2deg]" />
            
            {/* Polaroid Body */}
            <div className="w-full h-full bg-white p-2 pb-7 shadow-2xl border border-gray-100 flex flex-col">
              <div className="flex-1 bg-gray-200 overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=400" 
                  alt="Us" 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-center mt-2 font-handwriting text-gray-500 text-sm">
                Forever 🤍
              </p>
            </div>
          </motion.div>

          <div className="absolute bottom-4 right-10 text-5xl opacity-10">✨</div>
        </div>
      </motion.div>
    </div>
  );
}