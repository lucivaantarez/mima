'use client';

import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';

// ─── Quote ────────────────────────────────────────────────────────────────────
const VOICE_QUOTE =
  "you can say that now i got addicted to your voice cuz u were cute, warm, calm like uhhhh i'm gonna make u mine forever HAHAHHAHA";

// ─── Waveform bar ─────────────────────────────────────────────────────────────
function WaveBar({ delay }: { delay: number }) {
  return (
    <motion.div
      className="w-[2px] rounded-full"
      style={{ backgroundColor: 'currentColor' }}
      animate={{ height: [3, 11, 3] }}
      transition={{
        duration: 0.65,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    />
  );
}

// ─── Single voice channel user ────────────────────────────────────────────────
interface VoiceUserProps {
  username: string;
  initial: string;
  avatarGradient: string;
  accentColor: string;
  barDelayOffset: number;
  ringDelayOffset: number;
}

function VoiceUser({
  username,
  initial,
  avatarGradient,
  accentColor,
  barDelayOffset,
  ringDelayOffset,
}: VoiceUserProps) {
  return (
    <div className="flex items-center gap-3 py-[7px]">
      {/* Avatar + speaking ring */}
      <div className="relative flex-shrink-0">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-light text-white"
          style={{ background: avatarGradient }}
        >
          {initial}
        </div>

        {/* Animated speaking ring */}
        <motion.div
          className="absolute rounded-full border-[1.5px]"
          style={{
            inset: -3,
            borderColor: accentColor,
          }}
          animate={{ opacity: [0.9, 0.2, 0.9], scale: [1, 1.06, 1] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: ringDelayOffset,
          }}
        />
      </div>

      {/* Username */}
      <span
        className="flex-1 text-[12px] font-light text-white/70 tracking-wide"
        style={{ fontFamily: '"Exo 2", sans-serif' }}
      >
        {username}
      </span>

      {/* Live waveform bars */}
      <div
        className="flex items-end gap-[2.5px] h-[14px]"
        style={{ color: accentColor }}
      >
        {[0, 0.11, 0.22, 0.07].map((d, i) => (
          <WaveBar key={i} delay={barDelayOffset + d} />
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function DiscordCard() {
  return (
    <motion.div
      className="w-full max-w-[320px] mx-auto"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.85, ease: 'easeOut' }}
    >
      {/* Section label */}
      <p
        className="text-[8px] tracking-[0.5em] text-white/28 uppercase text-center mb-5"
        style={{ fontFamily: '"Exo 2", sans-serif' }}
      >
        where it began
      </p>

      {/* ── Discord voice glass card ── */}
      <div className="glass-card p-5 rounded-2xl">
        {/* Header bar */}
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/[0.05]">
          {/* Live indicator */}
          <motion.div
            className="w-[7px] h-[7px] rounded-full bg-green-400"
            style={{ boxShadow: '0 0 8px rgba(74,222,128,0.85)' }}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          <span
            className="text-[9px] text-white/38 tracking-[0.28em] uppercase flex-1"
            style={{ fontFamily: '"Exo 2", sans-serif' }}
          >
            Voice Connected
          </span>
          <Mic size={11} color="rgba(255,255,255,0.22)" />
        </div>

        {/* Channel */}
        <p
          className="text-[9px] text-saturn-blue/45 tracking-[0.22em] uppercase mb-3"
          style={{ fontFamily: '"Exo 2", sans-serif' }}
        >
          # general
        </p>

        {/* Users */}
        <div className="flex flex-col divide-y divide-white/[0.04]">
          <VoiceUser
            username="lanavienrose"
            initial="L"
            avatarGradient="linear-gradient(135deg, #f2a7ca 0%, #c87aab 100%)"
            accentColor="#f2a7ca"
            barDelayOffset={0}
            ringDelayOffset={0}
          />
          <VoiceUser
            username="peazyqn"
            initial="P"
            avatarGradient="linear-gradient(135deg, #8fb8ed 0%, #5a8ed4 100%)"
            accentColor="#8fb8ed"
            barDelayOffset={0.28}
            ringDelayOffset={0.4}
          />
        </div>
      </div>

      {/* ── Quote bubble ── */}
      <motion.div
        className="mt-4 glass-pink rounded-xl p-4"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.38, duration: 0.8 }}
      >
        {/* Quote text */}
        <p
          className="text-[11px] text-white/62 leading-[1.75] italic"
          style={{ fontFamily: '"Exo 2", sans-serif' }}
        >
          &ldquo;{VOICE_QUOTE}&rdquo;
        </p>

        {/* Attribution */}
        <p
          className="text-[9px] text-saturn-pink/50 mt-3 tracking-[0.25em]"
          style={{ fontFamily: '"Exo 2", sans-serif' }}
        >
          — lanavienrose
        </p>
      </motion.div>
    </motion.div>
  );
}
