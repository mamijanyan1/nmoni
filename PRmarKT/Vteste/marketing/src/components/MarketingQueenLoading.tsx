import React, { useState, useEffect } from 'react';
import * as motion from 'motion/react-client';
import { Sparkles, ShieldAlert } from 'lucide-react';

const LOADING_STEPS = [
  "Synchronizing Sovereign OS Command Matrix...",
  "Synthesizing Editorial & Design Standards...",
  "Aligning Sayat-Nova and Tumanyan stock inventory...",
  "Loading absolute 0% installment structures...",
  "Goddess SMM Oracle Core dispatch online..."
];

export default function MarketingQueenLoading() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 overflow-hidden select-none"
    >
      {/* Decorative Golden Ambient Backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-b from-amber-500/[0.04] to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-[300px] h-[300px] rounded-full bg-gradient-to-t from-pink-500/[0.02] to-transparent blur-[80px] pointer-events-none" />

      {/* Main Container */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.8 }}
        className="text-center space-y-8 relative z-10 max-w-md px-6"
      >
        {/* Animated Golden Ring with Logo */}
        <div className="relative flex justify-center">
          {/* Pulsing Back Glow */}
          <div className="absolute inset-0 rounded-full w-32 h-32 bg-amber-500/10 blur-xl animate-pulse mx-auto" />
          
          {/* Double Spinning Golden Halos */}
          <div className="absolute w-32 h-32 border border-dashed border-amber-500/30 rounded-full animate-spin-slow" />
          <div className="absolute w-[138px] h-[138px] border border-double border-amber-500/10 rounded-full animate-spin-reverse" />
          
          {/* Centered Profile & Logo */}
          <div className="relative w-32 h-32 bg-zinc-950 rounded-full flex items-center justify-center border-2 border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.15)] overflow-hidden">
            <img 
              src="/bplog.png" 
              alt="N Market Queen Logo" 
              className="w-full h-full object-cover p-1 scale-102 transition-transform hover:scale-105 duration-700" 
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Text Presentation Section */}
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.3em] text-amber-500 uppercase font-mono">
              The Sovereign Brand OS
            </span>
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
          </motion.div>

          <h1 className="font-sans text-3xl sm:text-5xl font-black tracking-tight text-white uppercase bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent select-none drop-shadow-md">
            N Market Queen
          </h1>

          <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-mono select-none">
            Universal SMM & Oracle Sandbox Engine
          </p>
        </div>

        {/* Loading Indicator with Step Carousel */}
        <div className="space-y-4 pt-4 max-w-sm mx-auto">
          {/* Progress bar container */}
          <div className="relative h-1 w-48 bg-zinc-900 border border-white/5 rounded-full mx-auto overflow-hidden">
            {/* Animating load bar */}
            <motion.div 
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-amber-500 via-yellow-400 to-pink-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.2, duration: 2.3, ease: "easeInOut" }}
            />
          </div>

          {/* Dynamic Loading Texts */}
          <div className="h-6 flex items-center justify-center overflow-hidden">
            <motion.p
              key={stepIndex}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              className="text-zinc-400 text-[10.5px] font-mono tracking-wide"
            >
              {LOADING_STEPS[stepIndex]}
            </motion.p>
          </div>
        </div>

        {/* Brand Seals */}
        <div className="pt-2 flex justify-center items-center gap-4 text-[9px] font-mono text-zinc-600 tracking-wider">
          <span>🛡️ Yerevan 3h Delivery SSL</span>
          <span>•</span>
          <span>🔒 1-Year Store Warranty Guard</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
