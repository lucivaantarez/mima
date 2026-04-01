'use client';

import { motion } from 'framer-motion';

// ─── Poem content ─────────────────────────────────────────────────────────────
const POEM_LINES = [
  'In a symphony of infinite melodies,',
  'Your voice is the only rhythm I crave.',
  'A drug that exists in no other universe,',
  'The only high that this heart will save.',
] as const;

// ─── Letter content ───────────────────────────────────────────────────────────
const LETTER =
  "Hi, Hola Mimaa, I built this to show you—I'm willing to learn anything and explore any new world, as long as I'm doing it for you. Since those mornings on Discord, thanks to Saken and Ruby I accidentally met you, I still can't believe how far we've become. I don't want to just be your favourite person anymore. I want more—I want you to be mine. As long as the moon orbits Saturn, I will always love you, to the moon and to saturn in eternity, Saturnity.";

// ─── Shared animation config ──────────────────────────────────────────────────
const VIEWPORT = { once: true, margin: '-100px' } as const;

// ─── Staggered poem line ──────────────────────────────────────────────────────
function PoemLine({ line, index }: { line: string; index: number }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{
        duration: 0.75,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: index * 0.14,
      }}
      // Cormorant Garamond italic via CSS variable injected by layout.tsx
      style={{
        fontFamily: 'var(--font-cormorant)',
        fontStyle: 'italic',
        fontWeight: 400,
        color: '#f2a7ca',
        lineHeight: 1.85,
        letterSpacing: '0.01em',
      }}
      className="text-[18px]"
    >
      {line}
    </motion.p>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Monologue() {
  return (
    // Outer section — enough vertical breathing room so whileInView triggers
    // at the right time on a short iPhone screen
    <section className="w-full py-20 px-6 relative z-0">
      {/* Section eyebrow */}
      <motion.p
        className="text-center mb-12 text-[8px] uppercase tracking-[0.5em] text-white/25"
        style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 300 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.9 }}
      >
        for mima
      </motion.p>

      {/* ── Glass card ── */}
      <div className="w-full max-w-[340px] mx-auto">
        <motion.div
          className="relative rounded-3xl overflow-hidden"
          style={{
            // Glass effect as specified
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            backgroundColor: 'rgba(17, 18, 20, 0.40)',
            border: '0.5px solid rgba(255, 255, 255, 0.10)',
            boxShadow:
              '0 0 40px rgba(242, 167, 202, 0.05), 0 24px 64px rgba(0, 0, 0, 0.55), inset 0 0 0 0.5px rgba(255,255,255,0.03)',
          }}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Inner top glow — barely perceptible pink ambiance */}
          <div
            className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(242,167,202,0.35) 50%, transparent 100%)',
            }}
            aria-hidden="true"
          />

          <div className="p-8 space-y-9">

            {/* ══════════════════════
                THE POEM — Symphony
            ══════════════════════ */}
            <div className="space-y-[2px]">
              {/* Tiny label above poem */}
              <motion.p
                className="text-[7.5px] uppercase tracking-[0.45em] text-saturn-pink/35 mb-5"
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontWeight: 300,
                }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                symphony
              </motion.p>

              <div className="space-y-1">
                {POEM_LINES.map((line, i) => (
                  <PoemLine key={i} line={line} index={i} />
                ))}
              </div>
            </div>

            {/* ══════════════════════
                DIVIDER
            ══════════════════════ */}
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.65, ease: 'easeOut', delay: 0.2 }}
              style={{ transformOrigin: 'center' }}
            >
              <div
                style={{
                  width: 40,
                  height: 1,
                  background:
                    'linear-gradient(to right, transparent, #f2a7ca, transparent)',
                }}
              />
            </motion.div>

            {/* ══════════════════════
                THE LETTER — Saturnity
            ══════════════════════ */}
            <div className="space-y-5">
              {/* Tiny label above letter */}
              <motion.p
                className="text-[7.5px] uppercase tracking-[0.45em] text-saturn-blue/35"
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontWeight: 300,
                }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                a letter
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.18 }}
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontWeight: 300,
                  lineHeight: 2.2,
                  letterSpacing: '0.025em',
                  color: 'rgba(255,255,255,0.78)',
                  textAlign: 'justify',
                  // Prevent orphan words on the last line
                  textAlignLast: 'left',
                  hyphens: 'auto',
                  WebkitHyphens: 'auto',
                  MozHyphens: 'auto',
                }}
                className="text-sm"
                lang="en"
              >
                {LETTER}
              </motion.p>

              {/* Sign-off */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.85, delay: 0.45 }}
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: '#f2a7ca',
                  letterSpacing: '0.03em',
                  lineHeight: 1.5,
                }}
                className="text-base text-right pt-2"
              >
                — lana sayang mima
              </motion.p>
            </div>
          </div>

          {/* Inner bottom glow */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(143,184,237,0.18) 50%, transparent 100%)',
            }}
            aria-hidden="true"
          />
        </motion.div>
      </div>
    </section>
  );
}
