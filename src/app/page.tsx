'use client';

// ─── React & Next ─────────────────────────────────────────────────────────────
import { useState, useRef, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';

// ─── Framer Motion ────────────────────────────────────────────────────────────
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionValueEvent,
  animate,
} from 'framer-motion';

// ─── Lucide icons ─────────────────────────────────────────────────────────────
import { Heart } from 'lucide-react';

// ─── Section components ───────────────────────────────────────────────────────
import DiscordCard  from '@/components/DiscordCard';
import PhotoGallery from '@/components/PhotoGallery';
import Monologue    from '@/components/Monologue';

// Howler lives inside MusicPlayer — dynamic import prevents SSR AudioContext crash
const MusicPlayer = dynamic(() => import('@/components/MusicPlayer'), {
  ssr: false,
});

// ─── Constants ────────────────────────────────────────────────────────────────
const HOLD_DURATION_MS  = 3000;   // ms user must hold before unlock
const SVG_SIZE          = 180;    // px — gateway circle SVG bounding box
const CIRCLE_RADIUS     = 65;     // px — gateway circle radius
const CIRCUMFERENCE     = 2 * Math.PI * CIRCLE_RADIUS; // ≈ 408.41 px
const WARP_DURATION_MS  = 1100;   // ms for space-warp animation before reveal
const FORCE_ENTER_MS    = 15000;  // ms after which Force Enter button appears

// NO button labels — escalate with each dodge
const NO_LABELS = [
  'no',
  'no..',
  'nope',
  'really?',
  'are u sure',
  'last chance',
  'fine... yes?',
] as const;

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase = 'gateway' | 'warping' | 'revealed';

// ═══════════════════════════════════════════════════════════════════════════════
// GATEWAY SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function IdleOrbitRing() {
  return (
    <motion.div
      className="absolute rounded-full border border-white/[0.06]"
      style={{ width: SVG_SIZE + 40, height: SVG_SIZE + 40 }}
      animate={{ scale: [1, 1.06, 1], opacity: [0.25, 0.08, 0.25] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

function ActiveOrbitRing() {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: SVG_SIZE + 40,
        height: SVG_SIZE + 40,
        boxShadow: '0 0 40px 1px rgba(242,167,202,0.15)',
      }}
      animate={{ scale: [1, 1.03, 1], opacity: [0.6, 0.18, 0.6] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TASK 7 — THE QUESTION
// ═══════════════════════════════════════════════════════════════════════════════

function TheQuestion() {
  const [answered, setAnswered]         = useState(false);
  const [noLabelIdx, setNoLabelIdx]     = useState(0);
  const [noX, setNoX]                   = useState(0);
  const [noY, setNoY]                   = useState(0);
  const lastConfettiRef                 = useRef(0);
  const confettiTimerRef                = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup any pending confetti timers on unmount
  useEffect(() => {
    return () => {
      if (confettiTimerRef.current !== null) {
        clearTimeout(confettiTimerRef.current);
      }
    };
  }, []);

  // ── YES handler — debounced confetti burst ──────────────────────────────────
  const handleYes = useCallback(async () => {
    const now = Date.now();
    if (now - lastConfettiRef.current < 2000) return;
    lastConfettiRef.current = now;
    setAnswered(true);

    const confetti = (await import('canvas-confetti')).default;

    // First burst — centered
    confetti({
      particleCount: 130,
      spread: 85,
      origin: { y: 0.58 },
      colors: ['#f2a7ca', '#8fb8ed', '#ffffff', '#fce4f0', '#d4eafc'],
      zIndex: 99999,
      disableForReducedMotion: true,
    });

    // Second burst — bilateral corners, 420 ms later
    confettiTimerRef.current = setTimeout(() => {
      confetti({
        particleCount: 65,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors: ['#f2a7ca', '#ffffff'],
        zIndex: 99999,
        disableForReducedMotion: true,
      });
      confetti({
        particleCount: 65,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors: ['#8fb8ed', '#ffffff'],
        zIndex: 99999,
        disableForReducedMotion: true,
      });
    }, 420);
  }, []);

  // ── NO handler — dodge within ±60 px of natural position ───────────────────
  const handleNoDodge = useCallback(() => {
    // If final label reached, treat it as yes
    if (noLabelIdx >= NO_LABELS.length - 1) {
      handleYes();
      return;
    }

    // Generate a new random offset, clamped to ±60 px
    const sign  = () => (Math.random() > 0.5 ? 1 : -1);
    const newX  = sign() * (22 + Math.random() * 38); // 22–60 px
    const newY  = sign() * (18 + Math.random() * 38); // 18–56 px
    setNoX(newX);
    setNoY(newY);
    setNoLabelIdx((prev) => Math.min(prev + 1, NO_LABELS.length - 1));
  }, [noLabelIdx, handleYes]);

  // ── Success state ───────────────────────────────────────────────────────────
  if (answered) {
    return (
      <motion.div
        className="flex flex-col items-center gap-6 text-center px-8 selectable"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Heart
            size={32}
            color="#f2a7ca"
            fill="#f2a7ca"
            strokeWidth={1}
          />
        </motion.div>

        <div className="flex flex-col gap-3">
          <p
            className="text-[28px] font-extralight tracking-[0.12em] text-white/90"
            style={{ fontFamily: '"Exo 2", sans-serif' }}
          >
            yes.
          </p>
          <p
            className="text-[11px] font-light text-white/45 tracking-[0.28em] uppercase"
            style={{ fontFamily: '"Exo 2", sans-serif' }}
          >
            always, forever.
          </p>
        </div>

        <p
          className="text-[13px] leading-[2] text-white/55 max-w-[260px]"
          style={{
            fontFamily:  'var(--font-cormorant)',
            fontStyle:   'italic',
            fontWeight:  400,
          }}
        >
          welcome to saturnity, mima.
          <br />
          this is just the beginning.
        </p>
      </motion.div>
    );
  }

  // ── Question state ──────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-10">
      {/* Prompt */}
      <motion.div
        className="text-center space-y-3"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <p
          className="text-[8px] font-extralight text-saturn-pink/40 uppercase tracking-[0.5em]"
          style={{ fontFamily: '"Exo 2", sans-serif' }}
        >
          one question
        </p>
        <p
          className="text-[22px] font-extralight text-white/88 tracking-wide leading-[1.55]"
          style={{ fontFamily: '"Exo 2", sans-serif' }}
        >
          so &hellip; will u be
          <br />
          my saturn?
        </p>
      </motion.div>

      {/* Buttons */}
      <div className="relative flex items-center justify-center gap-6 w-full">
        {/* YES */}
        <motion.button
          className="relative px-8 py-3 rounded-full text-[12px] font-light tracking-[0.28em] uppercase"
          style={{
            fontFamily:      '"Exo 2", sans-serif',
            background:      'linear-gradient(135deg, rgba(242,167,202,0.22) 0%, rgba(143,184,237,0.14) 100%)',
            border:          '1px solid rgba(242,167,202,0.35)',
            color:           '#f2a7ca',
            boxShadow:       '0 0 24px rgba(242,167,202,0.14)',
            willChange:      'transform, opacity',
          }}
          whileTap={{ scale: 0.95 }}
          onTap={handleYes}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, delay: 0.18 }}
        >
          yes
        </motion.button>

        {/* NO — dodges on onTapStart, before the finger lifts */}
        <motion.button
          className="px-6 py-3 rounded-full text-[11px] font-light tracking-[0.22em] uppercase"
          style={{
            fontFamily: '"Exo 2", sans-serif',
            background: 'rgba(255,255,255,0.04)',
            border:     '1px solid rgba(255,255,255,0.10)',
            color:      'rgba(255,255,255,0.35)',
            willChange: 'transform',
          }}
          animate={{ x: noX, y: noY }}
          transition={{ type: 'spring', stiffness: 380, damping: 22 }}
          onTapStart={handleNoDodge}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          {NO_LABELS[noLabelIdx]}
        </motion.button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function Home() {
  const [phase, setPhase]             = useState<Phase>('gateway');
  const [isHolding, setIsHolding]     = useState(false);
  const [displayPct, setDisplayPct]   = useState(0);
  const [showForceEnter, setShowForceEnter] = useState(false);

  // ── Motion value chain: rAF raw → spring smooth → SVG offset ────────────────
  const rawProgress    = useMotionValue(0);
  const springProgress = useSpring(rawProgress, {
    stiffness: 90,
    damping:   22,
    mass:      0.6,
  });
  const strokeDashoffset = useTransform(
    springProgress, [0, 100], [CIRCUMFERENCE, 0],
  );
  const ringOpacity = useTransform(springProgress, [0, 8], [0, 1]);

  // Sync spring value → React state for the percentage counter
  useMotionValueEvent(springProgress, 'change', (v) =>
    setDisplayPct(Math.round(v)),
  );

  // ── Stable refs ──────────────────────────────────────────────────────────────
  const rafRef       = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  // phaseRef lets the rAF closure read the latest phase without a stale closure
  const phaseRef     = useRef<Phase>('gateway');

  useEffect(() => { phaseRef.current = phase; }, [phase]);

  // ── 15-second Force Enter safety net ─────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'gateway') return;
    const timer = setTimeout(() => setShowForceEnter(true), FORCE_ENTER_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  // ── Warping → Revealed transition ─────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'warping') return;
    const timer = setTimeout(() => setPhase('revealed'), WARP_DURATION_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  // ── Cancel hold on pointer release ─────────────────────────────────────────
  const cancelHold = useCallback(() => {
    setIsHolding(false);
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (rawProgress.get() < 100) {
      animate(rawProgress, 0, { duration: 0.55, ease: 'easeOut' });
    }
  }, [rawProgress]);

  // ── Start hold — drives the rAF progress loop ───────────────────────────────
  const startHold = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    if (phaseRef.current !== 'gateway') return;

    setIsHolding(true);
    startTimeRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - (startTimeRef.current ?? now);
      const pct     = Math.min((elapsed / HOLD_DURATION_MS) * 100, 100);
      rawProgress.set(pct);

      if (pct >= 100) {
        rafRef.current = null;
        setIsHolding(false);
        setPhase('warping');
        return; // stop the loop
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [rawProgress]);

  // Music player unlocks the moment warp fires (before revealed)
  const isUnlocked = phase === 'warping' || phase === 'revealed';

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <main
      className="relative w-full min-h-[100dvh] bg-saturn-space font-exo"
      style={{
        paddingTop:    'env(safe-area-inset-top)',
        // Do NOT pad bottom here — let each section handle its own safe area
        isolation:     'isolate',
      }}
    >

      {/* ══════════════════════════════════════════════════════
          GATEWAY — Hold to unlock
      ══════════════════════════════════════════════════════ */}
      <motion.div
        className="fixed inset-0 flex flex-col items-center justify-center z-30"
        animate={
          phase === 'gateway'
            ? { opacity: 1, scale: 1 }
            : { opacity: 0, scale: 0.9 }
        }
        transition={{ duration: 0.38, ease: 'easeIn' }}
        // Remove from interaction layer once revealed so scroll works below
        style={{ pointerEvents: phase === 'gateway' ? 'auto' : 'none' }}
      >
        {/* Touch target */}
        <div
          className="relative flex items-center justify-center select-none"
          style={{ touchAction: 'none', cursor: 'pointer', WebkitUserSelect: 'none' }}
          onPointerDown={startHold}
          onPointerUp={cancelHold}
          onPointerLeave={cancelHold}
          onPointerCancel={cancelHold}
          onContextMenu={(e) => e.preventDefault()}
        >
          {isHolding ? <ActiveOrbitRing /> : <IdleOrbitRing />}

          {/* SVG progress ring */}
          <svg
            width={SVG_SIZE}
            height={SVG_SIZE}
            viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
            className="absolute"
            aria-hidden="true"
            style={{ transform: 'rotate(-90deg)' }}
          >
            {/* Base circle — 1 px white */}
            <circle
              cx={SVG_SIZE / 2}
              cy={SVG_SIZE / 2}
              r={CIRCLE_RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
            />
            {/* Animated progress arc — saturn pink */}
            <motion.circle
              cx={SVG_SIZE / 2}
              cy={SVG_SIZE / 2}
              r={CIRCLE_RADIUS}
              fill="none"
              stroke="#f2a7ca"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              style={{
                strokeDashoffset,
                opacity: ringOpacity,
                filter: 'drop-shadow(0 0 6px rgba(242,167,202,0.55))',
              }}
            />
          </svg>

          {/* Center label */}
          <div className="relative z-10 flex flex-col items-center gap-[10px]">
            <p
              className="text-[9px] font-extralight text-white/45 uppercase tracking-[0.3em]"
              style={{ fontFamily: '"Exo 2", sans-serif' }}
            >
              ALIGN ORBITS
            </p>
            <motion.p
              className="text-[8px] font-extralight uppercase tracking-[0.22em] tabular-nums"
              style={{ fontFamily: '"Exo 2", sans-serif' }}
              animate={
                isHolding
                  ? { color: '#f2a7ca' }
                  : { color: 'rgba(255,255,255,0.28)' }
              }
              transition={{ duration: 0.3 }}
            >
              {isHolding ? (
                `${displayPct}%`
              ) : (
                <motion.span
                  animate={{ opacity: [0.35, 1, 0.35] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                >
                  hold
                </motion.span>
              )}
            </motion.p>
          </div>
        </div>

        {/* 15-second Force Enter safety net */}
        <AnimatePresence>
          {showForceEnter && (
            <motion.button
              className="mt-14 text-[9px] font-extralight text-white/22 uppercase tracking-[0.35em]"
              style={{ fontFamily: '"Exo 2", sans-serif', touchAction: 'manipulation' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              onTap={() => setPhase('revealed')}
            >
              having trouble? force enter
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ══════════════════════════════════════════════════════
          SPACE WARP — Ring burst on unlock
          Uses position: fixed so it covers the viewport
          even as the revealed content starts rendering below
      ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {phase === 'warping' && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-40">
            {/* Radial glow burst */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: SVG_SIZE,
                height: SVG_SIZE,
                background:
                  'radial-gradient(circle, rgba(242,167,202,0.25) 0%, rgba(143,184,237,0.12) 45%, transparent 70%)',
                boxShadow:
                  '0 0 80px 20px rgba(242,167,202,0.20), 0 0 160px 40px rgba(143,184,237,0.10)',
                willChange: 'transform, opacity',
              }}
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 110, opacity: [1, 0.6, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            />
            {/* Ring trace */}
            <motion.div
              className="absolute rounded-full border border-saturn-pink/60"
              style={{
                width: SVG_SIZE,
                height: SVG_SIZE,
                willChange: 'transform, opacity',
              }}
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 115, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════
          REVEALED — Full scrollable experience
      ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {phase === 'revealed' && (
          <motion.div
            className="relative w-full z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.95, ease: 'easeOut' }}
          >

            {/* ── HERO TITLE ─────────────────────────────────── */}
            <section
              className="min-h-[100dvh] flex flex-col items-center justify-center px-8 text-center gap-8"
              style={{ paddingTop: 'env(safe-area-inset-top)' }}
            >
              <motion.div
                className="flex flex-col items-center gap-3"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.05, ease: 'easeOut', delay: 0.22 }}
              >
                <p
                  className="text-[8px] font-extralight text-saturn-pink/55 uppercase tracking-[0.55em]"
                  style={{ fontFamily: '"Exo 2", sans-serif' }}
                >
                  welcome to
                </p>
                <h1
                  className="text-[36px] font-extralight tracking-[0.22em] text-white/90"
                  style={{ fontFamily: '"Exo 2", sans-serif' }}
                >
                  SATURNITY
                </h1>
              </motion.div>

              {/* Vertical divider line */}
              <motion.div
                className="w-px h-14 bg-gradient-to-b from-saturn-pink/40 via-saturn-blue/20 to-transparent"
                initial={{ scaleY: 0, originY: '0%' }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.95, delay: 0.58, ease: 'easeOut' }}
              />

              <motion.p
                className="text-[9px] font-extralight text-white/22 uppercase tracking-[0.38em]"
                style={{ fontFamily: '"Exo 2", sans-serif' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.8 }}
              >
                scroll to begin
              </motion.p>
            </section>

            {/* ── DISCORD GENESIS ────────────────────────────── */}
            <section className="py-16 px-6">
              <DiscordCard />
            </section>

            {/* ── PHOTO GALLERY ──────────────────────────────── */}
            <section className="py-16">
              <PhotoGallery />
            </section>

            {/* ── MONOLOGUE — Poem & Letter ──────────────────── */}
            <Monologue />

            {/* ── THE QUESTION ───────────────────────────────── */}
            {/*
                pb-[calc(env(safe-area-inset-bottom)+5rem)] — the 5rem
                (80 px) gives breathing room above Safari's interactive
                tab bar deadzone at the bottom of the screen. Without
                this, the YES button can land exactly behind the tab bar.
            */}
            <section
              className="flex flex-col items-center justify-center px-8 py-20"
              style={{
                paddingBottom: 'calc(env(safe-area-inset-bottom) + 5rem)',
              }}
            >
              <TheQuestion />
            </section>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════
          FLOATING MUSIC PLAYER
          Fixed bottom-left; dynamically imported (SSR safe)
          Receives isUnlocked so it auto-starts on warp
      ══════════════════════════════════════════════════════ */}
      <MusicPlayer isUnlocked={isUnlocked} />

    </main>
  );
}
