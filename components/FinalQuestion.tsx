'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useAnimationControls, AnimatePresence } from 'framer-motion';

/* canvas-confetti loaded dynamically to avoid SSR */
async function fireConfetti() {
  const confetti = (await import('canvas-confetti')).default;

  /* First burst — wide spread */
  confetti({
    particleCount: 140,
    spread:        90,
    origin:        { y: 0.65 },
    colors:        ['#f2a7ca', '#8fb8ed', '#ffffff', '#e879a0', '#60a5fa'],
    scalar:        1.1,
    gravity:       0.9,
    drift:         0.1,
  });

  /* Second burst — tight upward jet */
  setTimeout(() => {
    confetti({
      particleCount: 80,
      angle:         90,
      spread:        55,
      origin:        { y: 0.7 },
      colors:        ['#f2a7ca', '#ffffff', '#8fb8ed'],
      scalar:        0.9,
      startVelocity: 45,
    });
  }, 180);

  /* Side bursts */
  setTimeout(() => {
    confetti({ particleCount: 50, angle: 60,  spread: 55,
      origin: { x: 0, y: 0.6 }, colors: ['#f2a7ca', '#fff'] });
    confetti({ particleCount: 50, angle: 120, spread: 55,
      origin: { x: 1, y: 0.6 }, colors: ['#8fb8ed', '#fff'] });
  }, 350);
}

/* ── The elusive NO button ──────────────────────────────────── */
function NoButton() {
  const controls    = useAnimationControls();
  const containerRef = useRef<HTMLDivElement>(null);
  const lastDodgeRef = useRef(0);

  const dodge = useCallback((e: React.PointerEvent | React.MouseEvent) => {
    const now = Date.now();
    /* Throttle — only dodge every 200 ms */
    if (now - lastDodgeRef.current < 200) return;
    lastDodgeRef.current = now;

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const btnCX = rect.left + rect.width  / 2;
    const btnCY = rect.top  + rect.height / 2;

    /* Vector from pointer to button center */
    const dx = btnCX - e.clientX;
    const dy = btnCY - e.clientY;
    const dist = Math.hypot(dx, dy);

    /* Flee only when pointer within 80px */
    if (dist > 80) return;

    const flee = 110 + Math.random() * 70;
    const nx   = (dx / dist) * flee;
    const ny   = (dy / dist) * flee;

    /* Clamp within viewport */
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const clampX = Math.max(
      -(rect.left),
      Math.min(vw - rect.right, nx)
    );
    const clampY = Math.max(
      -(rect.top  - 60),
      Math.min(vh - rect.bottom - 60, ny)
    );

    controls.start({
      x:          clampX,
      y:          clampY,
      rotate:     (Math.random() - 0.5) * 30,
      transition: { type: 'spring', stiffness: 520, damping: 22 },
    });
  }, [controls]);

  return (
    <motion.div
      ref={containerRef}
      animate={controls}
      onPointerMove={dodge}
      onMouseMove={dodge}
      style={{ display: 'inline-block' }}
    >
      <motion.button
        className="px-10 py-3.5 rounded-full text-white/40 text-xs tracking-[0.35em] uppercase font-light"
        style={{
          border:         '1px solid rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
          background:     'transparent',
          cursor:         'default',
        }}
        whileTap={{ scale: 0.95 }}
        aria-label="No"
      >
        no
      </motion.button>
    </motion.div>
  );
}

/* ── Main component ─────────────────────────────────────────── */
interface FinalQuestionProps {
  onYes: () => void;
}

export default function FinalQuestion({ onYes }: FinalQuestionProps) {
  const [answered, setAnswered] = useState(false);

  const handleYes = async () => {
    if (answered) return;
    setAnswered(true);
    await fireConfetti();
    setTimeout(onYes, 1800);
  };

  return (
    <section className="w-full px-5 pb-4">
      {/* Section label */}
      <p className="text-[9px] tracking-[0.35em] text-white/30 uppercase mb-8 px-1">
        The Question
      </p>

      {/* Question card */}
      <motion.div
        className="relative rounded-3xl overflow-hidden px-7 py-12 flex flex-col items-center gap-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background:
            'linear-gradient(160deg, rgba(242,167,202,0.07) 0%, rgba(5,5,16,0.9) 60%, rgba(143,184,237,0.07) 100%)',
          border:     '1px solid rgba(255,255,255,0.08)',
          boxShadow:
            '0 0 80px rgba(242,167,202,0.08), 0 0 80px rgba(143,184,237,0.08), inset 0 1px 0 rgba(255,255,255,0.07)',
        }}
      >
        {/* Orbiting ring decoration */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        >
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.06]"
            viewBox="0 0 400 300"
            preserveAspectRatio="xMidYMid meet"
          >
            <ellipse cx="200" cy="150" rx="180" ry="40"
              fill="none" stroke="#f2a7ca" strokeWidth="1"
              strokeDasharray="6 10" />
          </svg>
        </motion.div>

        {/* Saturn glyph */}
        <motion.div
          animate={{
            y:       [0, -10, 0],
            opacity: [0.5, 0.9, 0.5],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="relative">
            <span
              className="text-5xl select-none"
              role="img" aria-label="Saturn"
            >
              🪐
            </span>
            <motion.div
              className="absolute inset-0 rounded-full blur-2xl opacity-30"
              style={{ background: 'radial-gradient(#f2a7ca, transparent)' }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>

        {/* The question text */}
        <div className="text-center">
          <motion.p
            className="text-white/85 uppercase tracking-[0.4em] font-extralight"
            style={{ fontSize: '0.8rem', lineHeight: 2 }}
            initial={{ opacity: 0, letterSpacing: '0.15em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.4em' }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          >
            so ...
          </motion.p>
          <motion.p
            className="text-white uppercase tracking-[0.4em] font-extralight"
            style={{ fontSize: '0.9rem', lineHeight: 2 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            will u be my saturn?
          </motion.p>
        </div>

        {/* Buttons */}
        <AnimatePresence>
          {!answered && (
            <motion.div
              className="flex flex-col items-center gap-5 w-full"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* YES */}
              <motion.button
                onClick={handleYes}
                className="w-full max-w-[220px] py-4 rounded-full bg-white text-black font-bold text-xs tracking-[0.3em] uppercase"
                style={{
                  boxShadow:
                    '0 0 30px rgba(242,167,202,0.4), 0 4px 20px rgba(0,0,0,0.3)',
                }}
                whileHover={{
                  scale:     1.04,
                  boxShadow: '0 0 50px rgba(242,167,202,0.6), 0 4px 24px rgba(0,0,0,0.3)',
                }}
                whileTap={{ scale: 0.97 }}
              >
                yes ✦
              </motion.button>

              {/* NO — dodges away */}
              <NoButton />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Post-click sparkle */}
        {answered && (
          <motion.p
            className="text-saturn-pink/80 text-xs tracking-[0.3em] uppercase font-light"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            ✦ orbit accepted ✦
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}

