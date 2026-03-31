'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useSpring, useTransform, animate } from 'framer-motion';

interface CosmicGatewayProps {
  onUnlocked: () => void;
}

function describeArc(
  cx: number, cy: number, r: number, progress: number
): string {
  if (progress <= 0) return '';
  if (progress >= 1)
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.001} ${cy - r} Z`;
  const angle    = progress * 2 * Math.PI - Math.PI / 2;
  const x        = cx + r * Math.cos(angle);
  const y        = cy + r * Math.sin(angle);
  const largeArc = progress > 0.5 ? 1 : 0;
  return `M ${cx} ${cy - r} A ${r} ${r} 0 ${largeArc} 1 ${x} ${y}`;
}

const HOLD_DURATION = 3000;
const CIRCLE_R      = 56;
const CX = 80;
const CY = 80;

export default function CosmicGateway({ onUnlocked }: CosmicGatewayProps) {
  const [phase, setPhase]             = useState<'idle'|'holding'|'warping'>('idle');
  const [arcProgress, setArcProgress] = useState(0);
  const holdStart    = useRef<number | null>(null);
  const rafRef       = useRef<number | null>(null);
  const completedRef = useRef(false);

  const springVal  = useSpring(0, { stiffness: 80, damping: 18 });
  const displayPct = useTransform(springVal, (v) => `${Math.round(v)}%`);

  const tick = useCallback(() => {
    if (!holdStart.current) return;
    const elapsed  = Date.now() - holdStart.current;
    const progress = Math.min(elapsed / HOLD_DURATION, 1);
    setArcProgress(progress);
    springVal.set(progress * 100);
    if (progress < 1) {
      rafRef.current = requestAnimationFrame(tick);
    } else if (!completedRef.current) {
      completedRef.current = true;
      setPhase('warping');
      setTimeout(onUnlocked, 900);
    }
  }, [springVal, onUnlocked]);

  const startHold = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    if (phase !== 'idle') return;
    completedRef.current = false;
    holdStart.current    = Date.now();
    setPhase('holding');
    rafRef.current = requestAnimationFrame(tick);
  }, [phase, tick]);

  const cancelHold = useCallback(() => {
    if (phase !== 'holding') return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    holdStart.current = null;
    setPhase('idle');
    const from = arcProgress;
    animate(from, 0, {
      duration: 0.4,
      ease: 'easeOut',
      onUpdate: (v) => {
        setArcProgress(v);
        springVal.set(v * 100);
      },
    });
  }, [phase, arcProgress, springVal]);

  useEffect(() => {
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const arcPath = describeArc(CX, CY, CIRCLE_R, arcProgress);

  return (
    <div className="relative w-full min-h-[100dvh] safe-screen flex items-center justify-center select-none">
      {phase === 'warping' && (
        <motion.div
          className="fixed inset-0 z-50 bg-saturn-pink/20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 0.9, times: [0, 0.3, 1] }}
        />
      )}

      <motion.div
        className="relative flex items-center justify-center"
        onPointerDown={startHold}
        onPointerUp={cancelHold}
        onPointerLeave={cancelHold}
        onPointerCancel={cancelHold}
        style={{ touchAction: 'none', cursor: 'pointer' }}
        animate={phase === 'warping'
          ? { scale: [1, 14, 40], opacity: [1, 0.5, 0] }
          : { scale: 1, opacity: 1 }}
        transition={phase === 'warping'
          ? { duration: 0.9, ease: [0.4, 0, 0.2, 1] }
          : {}}
      >
        <svg width={160} height={160} viewBox="0 0 160 160"
          className="absolute" aria-hidden="true">
          <circle cx={CX} cy={CY} r={CIRCLE_R} fill="none"
            stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          {arcProgress > 0 && (
            <path d={arcPath} fill="none" stroke="#f2a7ca"
              strokeWidth="2" strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 6px #f2a7ca) drop-shadow(0 0 12px #f2a7ca88)' }}
            />
          )}
          {arcProgress > 0 && arcProgress < 1 && (() => {
            const angle = arcProgress * 2 * Math.PI - Math.PI / 2;
            const tx = CX + CIRCLE_R * Math.cos(angle);
            const ty = CY + CIRCLE_R * Math.sin(angle);
            return (
              <circle cx={tx} cy={ty} r="3" fill="#f2a7ca"
                style={{ filter: 'drop-shadow(0 0 4px #f2a7ca)' }} />
            );
          })()}
        </svg>

        <motion.div
          className="relative w-40 h-40 flex flex-col items-center justify-center gap-2"
          animate={{ scale: phase === 'holding' ? 0.96 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <motion.span
            className="text-saturn-pink font-extralight text-xs tracking-widest"
            style={{ opacity: arcProgress > 0 ? 1 : 0 }}
          >
            {displayPct}
          </motion.span>
          <motion.p
            className="text-white/80 font-extralight text-[10px] tracking-[0.3em] uppercase text-center leading-relaxed"
            animate={{
              opacity:       phase === 'warping' ? 0 : 1,
              letterSpacing: phase === 'holding' ? '0.4em' : '0.3em',
            }}
            transition={{ duration: 0.3 }}
          >
            {phase === 'holding' ? 'ALIGNING…' : 'ALIGN\nORBITS'}
          </motion.p>
          {phase === 'idle' && (
            <motion.div
              className="absolute inset-0 rounded-full border border-white/10"
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </motion.div>
      </motion.div>

      <motion.p
        className="absolute bottom-[calc(env(safe-area-inset-bottom)+2rem)] text-white/25 text-[9px] tracking-[0.25em] uppercase"
        animate={{ opacity: phase === 'idle' ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        Hold to unlock
      </motion.p>
    </div>
  );
}

