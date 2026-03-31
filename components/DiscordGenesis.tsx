'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/* ── Waveform bar — animates only when "speaking" ─────────── */
function WaveBar({
  delay,
  color,
  active,
}: {
  delay: number;
  color: string;
  active: boolean;
}) {
  return (
    <motion.span
      className="inline-block w-[3px] rounded-full mx-[1.5px]"
      style={{ backgroundColor: color, height: 10 }}
      animate={
        active
          ? {
              scaleY: [1, 2.8, 0.6, 2.2, 1],
              opacity: [0.6, 1, 0.7, 1, 0.6],
            }
          : { scaleY: 1, opacity: 0.25 }
      }
      transition={
        active
          ? {
              duration: 0.9,
              repeat: Infinity,
              repeatType: 'mirror',
              delay,
              ease: 'easeInOut',
            }
          : { duration: 0.4 }
      }
    />
  );
}

/* ── Single user row ──────────────────────────────────────── */
function UserRow({
  name,
  avatar,
  accentColor,
  glowColor,
  speaking,
  tag,
}: {
  name: string;
  avatar: string;
  accentColor: string;
  glowColor: string;
  speaking: boolean;
  tag: string;
}) {
  return (
    <motion.div
      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500"
      animate={{
        backgroundColor: speaking
          ? `${glowColor}14`
          : 'rgba(255,255,255,0.02)',
      }}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <motion.div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
          style={{ backgroundColor: `${accentColor}22`, color: accentColor }}
          animate={
            speaking
              ? {
                  boxShadow: [
                    `0 0 0px 0px ${glowColor}00`,
                    `0 0 0px 6px ${glowColor}44`,
                    `0 0 0px 0px ${glowColor}00`,
                  ],
                }
              : { boxShadow: 'none' }
          }
          transition={
            speaking
              ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
              : {}
          }
        >
          {avatar}
        </motion.div>

        {/* Online dot */}
        <span
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#050510]"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      {/* Name + waveform */}
      <div className="flex-1 min-w-0">
        <p
          className="text-xs font-medium tracking-wide truncate"
          style={{ color: accentColor }}
        >
          {name}
        </p>
        <p className="text-[9px] text-white/30 tracking-widest uppercase mt-0.5">
          {tag}
        </p>
      </div>

      {/* Waveform */}
      <div className="flex items-center h-6 shrink-0">
        {[0, 0.1, 0.2, 0.15, 0.05].map((delay, i) => (
          <WaveBar
            key={i}
            delay={delay}
            color={accentColor}
            active={speaking}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ── Breathing green dot ──────────────────────────────────── */
function NeonDot() {
  return (
    <motion.span
      className="inline-block w-2 h-2 rounded-full bg-emerald-400 shrink-0"
      animate={{
        opacity: [1, 0.4, 1],
        boxShadow: [
          '0 0 4px 1px #34d39988',
          '0 0 10px 3px #34d39966',
          '0 0 4px 1px #34d39988',
        ],
      }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

export default function DiscordGenesis() {
  /* Simulate turn-taking voice: lana speaks first, then peazy */
  const [speaker, setSpeaker] = useState<'lana' | 'peazy' | 'both'>('lana');
  const cycleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const schedule = () => {
      cycleRef.current = setTimeout(() => {
        setSpeaker((s) => {
          if (s === 'lana') return 'peazy';
          if (s === 'peazy') return 'both';
          return 'lana';
        });
        schedule();
      }, 2800 + Math.random() * 1200);
    };
    schedule();
    return () => {
      if (cycleRef.current) clearTimeout(cycleRef.current);
    };
  }, []);

  return (
    <motion.section
      className="w-full px-5"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Section label */}
      <p className="text-[9px] tracking-[0.35em] text-white/30 uppercase mb-3 px-1">
        Memory · Origin
      </p>

      {/* Glass card */}
      <div
        className="glass-card rounded-2xl overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, rgba(242,167,202,0.07) 0%, rgba(143,184,237,0.07) 100%)',
          boxShadow:
            '0 0 40px 0 rgba(242,167,202,0.1), 0 0 40px 0 rgba(143,184,237,0.1), inset 0 1px 0 rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Discord header bar */}
        <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-white/[0.06]">
          {/* Discord-style icon */}
          <div className="w-5 h-5 shrink-0 opacity-60">
            <svg viewBox="0 0 24 24" fill="#8fb8ed">
              <path d="M18.942 5.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.586 11.586 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 2.868 18.26a15.785 15.785 0 0 0 4.963 2.521 11.83 11.83 0 0 0 1.004-1.658 10.585 10.585 0 0 1-1.6-.8c.134-.098.265-.2.39-.304a11.37 11.37 0 0 0 9.748 0c.126.104.258.206.39.304a10.585 10.585 0 0 1-1.6.8 11.83 11.83 0 0 0 1.004 1.658 15.785 15.785 0 0 0 4.963-2.521A17.392 17.392 0 0 0 18.942 5.556zM8.687 15.116c-.994 0-1.797-.921-1.797-2.05s.793-2.05 1.797-2.05c1.004 0 1.817.921 1.797 2.05.02 1.129-.793 2.05-1.797 2.05zm6.626 0c-.994 0-1.797-.921-1.797-2.05s.793-2.05 1.797-2.05c1.004 0 1.817.921 1.797 2.05.02 1.129-.793 2.05-1.797 2.05z" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-white/60 tracking-widest uppercase font-light">
              Voice Connected
            </p>
            <p className="text-[9px] text-white/30 tracking-wide truncate">
              ✦ private · cosmic-lounge
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <NeonDot />
            <span className="text-[9px] text-emerald-400/70 tracking-wider">
              LIVE
            </span>
          </div>
        </div>

        {/* Users */}
        <div className="py-1">
          <UserRow
            name="lanavienrose"
            avatar="L"
            accentColor="#f2a7ca"
            glowColor="#f2a7ca"
            speaking={speaker === 'lana' || speaker === 'both'}
            tag="#0001 · saturn"
          />
          <UserRow
            name="peazyqn"
            avatar="P"
            accentColor="#8fb8ed"
            glowColor="#8fb8ed"
            speaking={speaker === 'peazy' || speaker === 'both'}
            tag="#0002 · orbit"
          />
        </div>

        {/* Quote block */}
        <div className="mx-4 mb-4 mt-2 rounded-xl p-4 border border-white/[0.06] bg-white/[0.03]">
          {/* Quote mark */}
          <p className="text-saturn-pink/40 text-2xl leading-none font-serif mb-2 select-none">
            "
          </p>
          <p className="text-white/50 text-[11px] leading-[1.8] font-light tracking-wide italic">
            you can say that now i got addicted to your voice cuz u were cute,
            warm, calm like uhhhh i&apos;m gonna make u mine forever{' '}
            <span className="text-saturn-pink/70 not-italic font-normal">
              HAHAHHAHA
            </span>
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="w-4 h-px bg-saturn-pink/30" />
            <p className="text-[9px] text-saturn-pink/50 tracking-widest uppercase">
              lanavienrose
            </p>
          </div>
        </div>

        {/* Timestamp footer */}
        <div className="px-4 pb-3 flex items-center justify-between">
          <p className="text-[8px] text-white/15 tracking-widest uppercase">
            where it began
          </p>
          <p className="text-[8px] text-white/15 tracking-wider">
            ∞ : ∞ : ∞
          </p>
        </div>
      </div>
    </motion.section>
  );
}
