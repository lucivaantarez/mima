'use client';

import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion';

const POEM_LINES = [
  { text: 'In a symphony of infinite melodies,',  delay: 0    },
  { text: 'Your voice is the only rhythm I crave.',  delay: 0.12 },
  { text: 'A drug that exists in no other universe,', delay: 0.24 },
  { text: 'The only high that this heart will save.', delay: 0.36 },
];

/* ── One poem line — reveals as it enters viewport ─────────── */
function PoemLine({
  line,
  index,
  containerRef,
}: {
  line: { text: string; delay: number };
  index: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    container: containerRef,
    offset: ['start 95%', 'start 55%'],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 18,
    restDelta: 0.001,
  });

  const opacity  = useTransform(smooth, [0, 1], [0, 1]);
  const y        = useTransform(smooth, [0, 1], [28, 0]);
  const blur     = useTransform(smooth, [0, 1], [8, 0]);

  /* Last line gets the pink accent */
  const isAccent = index === POEM_LINES.length - 1;

  return (
    <motion.span
      ref={ref}
      className="block"
      style={{
        opacity,
        y,
        filter: useTransform(blur, (b) => `blur(${b}px)`),
      }}
    >
      <span
        className={
          isAccent
            ? 'text-saturn-pink/90'
            : 'text-white/80'
        }
      >
        {line.text}
      </span>
    </motion.span>
  );
}

/* ── Floating decorative glyph ──────────────────────────────── */
function FloatingGlyph({ char, style }: { char: string; style: React.CSSProperties }) {
  return (
    <motion.span
      className="absolute text-saturn-pink/10 font-serif select-none pointer-events-none"
      style={style}
      animate={{
        y:       [0, -12, 0],
        opacity: [0.08, 0.18, 0.08],
      }}
      transition={{
        duration: 6 + Math.random() * 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {char}
    </motion.span>
  );
}

export default function PoemSymphony({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <section className="w-full px-5 relative">

      {/* Section label */}
      <p className="text-[9px] tracking-[0.35em] text-white/30 uppercase mb-6 px-1">
        Memory · Symphony
      </p>

      {/* Outer glass frame */}
      <div
        className="relative rounded-3xl overflow-hidden px-7 py-10"
        style={{
          background:
            'linear-gradient(160deg, rgba(242,167,202,0.05) 0%, rgba(5,5,16,0.8) 50%, rgba(143,184,237,0.05) 100%)',
          border:     '1px solid rgba(255,255,255,0.07)',
          boxShadow:
            '0 0 60px 0 rgba(242,167,202,0.06), 0 0 60px 0 rgba(143,184,237,0.06), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {/* Background decorative glyphs */}
        <FloatingGlyph char="♪" style={{ top: '8%',  right: '10%', fontSize: 48 }} />
        <FloatingGlyph char="♫" style={{ top: '55%', left: '5%',  fontSize: 32 }} />
        <FloatingGlyph char="✦" style={{ bottom: '12%', right: '8%', fontSize: 22 }} />

        {/* Top ornament */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="flex-1 h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(242,167,202,0.4))',
            }}
          />
          <span className="text-saturn-pink/50 text-xs tracking-widest">✦</span>
          <div
            className="flex-1 h-px"
            style={{
              background:
                'linear-gradient(90deg, rgba(143,184,237,0.4), transparent)',
            }}
          />
        </div>

        {/* Poem title */}
        <motion.p
          className="text-center text-white/25 text-[9px] tracking-[0.45em] uppercase mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        >
          Symphony
        </motion.p>

        {/* Poem body */}
        <div
          className="space-y-4 text-center"
          style={{
            fontFamily:  'var(--font-cormorant)',
            fontSize:    '1.35rem',
            lineHeight:  1.75,
            fontWeight:  300,
            fontStyle:   'italic',
            letterSpacing: '0.015em',
          }}
        >
          {POEM_LINES.map((line, i) => (
            <PoemLine
              key={i}
              line={line}
              index={i}
              containerRef={containerRef}
            />
          ))}
        </div>

        {/* Bottom ornament */}
        <div className="flex items-center gap-3 mt-10">
          <div
            className="flex-1 h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(242,167,202,0.2))',
            }}
          />
          <span className="text-white/10 text-[10px] tracking-[0.4em]">
            ∞
          </span>
          <div
            className="flex-1 h-px"
            style={{
              background:
                'linear-gradient(90deg, rgba(143,184,237,0.2), transparent)',
            }}
          />
        </div>
      </div>
    </section>
  );
}

