'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* 
  Drop your audio file at /public/audio/saturnity.mp3
  Howler is loaded dynamically to avoid SSR issues.
*/

interface AudioSystemProps {
  active: boolean; /* true once gateway is unlocked */
}

function SoundVisualizer({ muted, onClick }: {
  muted: boolean;
  onClick: () => void;
}) {
  const bars = [0.5, 1, 0.7, 0.9, 0.6];

  return (
    <motion.button
      className="flex items-end gap-[2px] h-5 px-1 cursor-pointer"
      onClick={onClick}
      aria-label={muted ? 'Unmute music' : 'Mute music'}
      whileTap={{ scale: 0.85 }}
    >
      {bars.map((baseH, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-saturn-pink/70"
          style={{ height: 4 }}
          animate={
            muted
              ? { scaleY: 0.3, opacity: 0.3 }
              : {
                  scaleY: [baseH, 1, baseH * 0.6, 0.95, baseH],
                  opacity: [0.6, 1, 0.7, 1, 0.6],
                }
          }
          transition={
            muted
              ? { duration: 0.3 }
              : {
                  duration: 0.8 + i * 0.1,
                  repeat: Infinity,
                  repeatType: 'mirror',
                  delay: i * 0.12,
                  ease: 'easeInOut',
                }
          }
        />
      ))}
    </motion.button>
  );
}

export default function AudioSystem({ active }: AudioSystemProps) {
  const [muted,   setMuted]   = useState(false);
  const [ready,   setReady]   = useState(false);
  const howlRef = useRef<import('howler').Howl | null>(null);

  /* Dynamically import Howler only on client */
  useEffect(() => {
    if (!active) return;

    let cancelled = false;

    import('howler').then(({ Howl }) => {
      if (cancelled) return;

      howlRef.current = new Howl({
        src:    ['/audio/saturnity.mp3'],
        loop:   true,
        volume: 0,           /* start silent — fade in below */
        html5:  true,        /* required for iOS streaming    */
        onload: () => {
          if (cancelled) return;
          setReady(true);
          howlRef.current!.play();
          /* 3-second fade to 0.55 volume */
          howlRef.current!.fade(0, 0.55, 3000);
        },
      });
    });

    return () => {
      cancelled = true;
      howlRef.current?.unload();
    };
  }, [active]);

  const toggleMute = () => {
    if (!howlRef.current) return;
    const next = !muted;
    setMuted(next);
    if (next) {
      howlRef.current.fade(howlRef.current.volume(), 0, 600);
    } else {
      howlRef.current.fade(howlRef.current.volume(), 0.55, 600);
    }
  };

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed z-50 flex items-center gap-2"
          style={{
            top:   'max(env(safe-area-inset-top), 1rem)',
            right: 'max(env(safe-area-inset-right), 1.25rem)',
          }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border:     '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <SoundVisualizer muted={muted} onClick={toggleMute} />
            <span className="text-[8px] text-white/25 tracking-[0.25em] uppercase select-none">
              {muted ? 'off' : 'on'}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

