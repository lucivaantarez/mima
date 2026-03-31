'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

async function finalConfetti() {
  const confetti = (await import('canvas-confetti')).default;
  const end = Date.now() + 3200;

  const frame = () => {
    confetti({
      particleCount: 5,
      angle:         60,
      spread:        55,
      origin:        { x: 0, y: 0.5 },
      colors:        ['#f2a7ca', '#8fb8ed', '#ffffff'],
      scalar:        0.9,
    });
    confetti({
      particleCount: 5,
      angle:         120,
      spread:        55,
      origin:        { x: 1, y: 0.5 },
      colors:        ['#f2a7ca', '#8fb8ed', '#ffffff'],
      scalar:        0.9,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

export default function SuccessState() {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    const t = setTimeout(finalConfetti, 600);
    return () => clearTimeout(t);
  }, []);

  const lines = [
    { text: 'Eternity starts now.',         delay: 0.3  },
    { text: 'See you in our next orbit,',   delay: 0.75 },
    { text: 'Girlfriend.',                  delay: 1.1, accent: true },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-8"
      style={{ background: '#050510' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      {/* Starfield still visible through fixed bg */}

      {/* Central glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[100px] opacity-20"
          style={{
            background: 'radial-gradient(circle, #f2a7ca 0%, #8fb8ed 50%, transparent 80%)',
          }}
        />
      </motion.div>

      {/* Planet icon */}
      <motion.div
        className="mb-12 relative"
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.span
          className="text-6xl block text-center"
          animate={{ rotate: [0, 5, -5, 0], y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          🪐
        </motion.span>
        <motion.div
          className="absolute inset-0 rounded-full blur-3xl opacity-40"
          style={{ background: 'radial-gradient(#f2a7ca, transparent)' }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Message lines */}
      <div className="text-center space-y-4">
        {lines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
            transition={{
              duration: 1,
              delay: line.delay,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              fontFamily:    'var(--font-cormorant)',
              fontSize:      line.accent ? '2.2rem' : '1.25rem',
              fontWeight:    line.accent ? 400 : 300,
              fontStyle:     'italic',
              color:         line.accent
                ? 'rgba(242,167,202,0.92)'
                : 'rgba(255,255,255,0.72)',
              lineHeight:    1.4,
              letterSpacing: '0.02em',
            }}
          >
            {line.text}
          </motion.p>
        ))}
      </div>

      {/* Bottom eternal stamp */}
      <motion.div
        className="absolute"
        style={{ bottom: 'max(env(safe-area-inset-bottom), 2.5rem)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 2 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-px bg-saturn-pink/30" />
          <p className="text-[8px] text-white/20 tracking-[0.5em] uppercase">
            Project Saturnity · ∞
          </p>
          <div className="w-8 h-px bg-saturn-blue/30" />
        </div>
      </motion.div>
    </motion.div>
  );
}

