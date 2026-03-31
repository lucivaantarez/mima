'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/* ── Ink-bleed reveal for a single paragraph ────────────────── */
function RevealParagraph({
  children,
  containerRef,
  delay = 0,
}: {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement | null>;
  delay?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    container: containerRef,
    offset: ['start 98%', 'start 60%'],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 45,
    damping: 16,
    restDelta: 0.001,
  });

  const opacity = useTransform(smooth, [0, 1], [0, 1]);
  const y       = useTransform(smooth, [0, 1], [20, 0]);

  return (
    <motion.p
      ref={ref}
      style={{ opacity, y }}
      transition={{ delay }}
    >
      {children}
    </motion.p>
  );
}

/* ── Wax seal decoration ────────────────────────────────────── */
function WaxSeal() {
  return (
    <motion.div
      className="flex flex-col items-center gap-2 pt-2"
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
    >
      {/* Seal circle */}
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center relative"
        style={{
          background:
            'radial-gradient(circle at 35% 35%, rgba(242,167,202,0.3), rgba(242,167,202,0.08))',
          border:     '1px solid rgba(242,167,202,0.25)',
          boxShadow:  '0 0 20px rgba(242,167,202,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        {/* Ring detail */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ border: '1px solid rgba(242,167,202,0.2)' }}
        >
          <span
            style={{
              fontFamily:   'var(--font-cormorant)',
              fontSize:     18,
              color:        'rgba(242,167,202,0.7)',
              fontStyle:    'italic',
              fontWeight:   400,
              lineHeight:   1,
              letterSpacing: '-0.02em',
            }}
          >
            S
          </span>
        </div>
      </div>

      <p className="text-[8px] text-white/20 tracking-[0.4em] uppercase">
        Saturnity
      </p>
    </motion.div>
  );
}

/* ── Paper texture lines ────────────────────────────────────── */
function PaperLines() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl opacity-[0.03]">
      {Array.from({ length: 22 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-full h-px bg-white"
          style={{ top: `${(i + 1) * 4.5}%` }}
        />
      ))}
    </div>
  );
}

/* Letter paragraphs split for staggered reveal */
const LETTER_PARAGRAPHS = [
  {
    id: 'salutation',
    isSpecial: true,
    content: null, // rendered separately
  },
  {
    id: 'p1',
    isSpecial: false,
    content:
      'I built this to show you — I\'m willing to learn anything and explore any new world, as long as I\'m doing it for you.',
  },
  {
    id: 'p2',
    isSpecial: false,
    content:
      'Since those mornings on Discord, thanks to Saken and Ruby I accidentally met you, I still can\'t believe how far we\'ve become.',
  },
  {
    id: 'p3',
    isSpecial: false,
    content:
      'I don\'t want to just be your favourite person anymore. I want more — I want you to be mine.',
  },
  {
    id: 'closing',
    isSpecial: true,
    content: null,
  },
];

export default function SaturnityLetter({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <section className="w-full px-4">

      {/* Section label */}
      <p className="text-[9px] tracking-[0.35em] text-white/30 uppercase mb-5 px-1">
        Memory · Letter
      </p>

      {/* Glass paper card */}
      <motion.div
        className="relative rounded-3xl overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background:
            'linear-gradient(170deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 40%, rgba(242,167,202,0.04) 100%)',
          border:     '1px solid rgba(255,255,255,0.10)',
          boxShadow:
            '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), 0 0 60px rgba(242,167,202,0.07), inset 0 1px 0 rgba(255,255,255,0.10)',
        }}
      >
        {/* Paper line texture */}
        <PaperLines />

        {/* Pink top edge glow */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent 5%, rgba(242,167,202,0.5) 30%, rgba(143,184,237,0.5) 70%, transparent 95%)',
          }}
        />

        {/* Letter body */}
        <div className="relative px-7 pt-9 pb-10 z-10">

          {/* Date / stamp area */}
          <motion.div
            className="flex justify-between items-start mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div>
              <p className="text-[8px] text-white/20 tracking-[0.35em] uppercase">
                From the cosmos
              </p>
              <p className="text-[8px] text-white/15 tracking-wider mt-0.5">
                ∞ / ∞ / ∞
              </p>
            </div>
            <div className="text-right">
              <p className="text-[8px] text-saturn-pink/30 tracking-[0.25em] uppercase">
                To · Mimaa
              </p>
              <p className="text-[8px] text-white/15 tracking-wider mt-0.5">
                ✦ personal
              </p>
            </div>
          </motion.div>

          {/* Salutation */}
          <RevealParagraph containerRef={containerRef} delay={0}>
            <span
              style={{
                fontFamily:   'var(--font-cormorant)',
                fontSize:     '1.6rem',
                fontWeight:   400,
                fontStyle:    'italic',
                color:        'rgba(242,167,202,0.85)',
                letterSpacing: '0.01em',
                display:      'block',
                marginBottom: '1.25rem',
                lineHeight:   1.3,
              }}
            >
              Hi, Hola Mimaa.
            </span>
          </RevealParagraph>

          {/* Body paragraphs */}
          <div
            className="space-y-5"
            style={{
              fontFamily:   'var(--font-cormorant)',
              fontSize:     '1.1rem',
              fontWeight:   300,
              lineHeight:   1.85,
              textAlign:    'justify',
              color:        'rgba(255,255,255,0.72)',
              letterSpacing: '0.008em',
              hyphens:      'auto',
            }}
          >
            <RevealParagraph containerRef={containerRef} delay={0.05}>
              I built this to show you —
              <em className="text-white/85 not-italic">
                {' '}I&apos;m willing to learn anything and explore any new world,{' '}
              </em>
              as long as I&apos;m doing it for you.
            </RevealParagraph>

            <RevealParagraph containerRef={containerRef} delay={0.1}>
              Since those mornings on Discord, thanks to{' '}
              <span className="text-saturn-blue/80">Saken</span> and{' '}
              <span className="text-saturn-blue/80">Ruby</span> I accidentally
              met you, I still can&apos;t believe how far we&apos;ve become.
            </RevealParagraph>

            <RevealParagraph containerRef={containerRef} delay={0.15}>
              I don&apos;t want to just be your favourite person anymore.{' '}
              <em
                style={{
                  fontStyle: 'italic',
                  color: 'rgba(242,167,202,0.85)',
                }}
              >
                I want more — I want you to be mine.
              </em>
            </RevealParagraph>
          </div>

          {/* Closing vow */}
          <motion.div
            className="mt-8 pt-6"
            style={{
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <p
              style={{
                fontFamily:   'var(--font-cormorant)',
                fontSize:     '1.05rem',
                fontWeight:   300,
                lineHeight:   1.9,
                textAlign:    'justify',
                color:        'rgba(255,255,255,0.55)',
                letterSpacing: '0.008em',
                hyphens:      'auto',
                marginBottom: '1.5rem',
              }}
            >
              As long as the moon orbits Saturn, I will always love you, to the
              moon and to saturn in eternity,
            </p>

            {/* Signature */}
            <div className="flex items-end justify-between">
              <div>
                <p
                  style={{
                    fontFamily:   'var(--font-cormorant)',
                    fontSize:     '1.9rem',
                    fontWeight:   400,
                    fontStyle:    'italic',
                    color:        'rgba(242,167,202,0.75)',
                    lineHeight:   1.1,
                    letterSpacing: '0.02em',
                  }}
                >
                  Saturnity.
                </p>
                <p className="text-[8px] text-white/20 tracking-[0.3em] uppercase mt-1.5">
                  forever &amp; beyond
                </p>
              </div>

              {/* Wax seal */}
              <WaxSeal />
            </div>
          </motion.div>
        </div>

        {/* Bottom edge glow */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent 5%, rgba(143,184,237,0.3) 40%, rgba(242,167,202,0.3) 70%, transparent 95%)',
          }}
        />
      </motion.div>

      {/* Below-card whisper */}
      <motion.p
        className="text-center text-[9px] text-white/15 tracking-[0.35em] uppercase mt-5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.5 }}
      >
        sealed with stardust
      </motion.p>
    </section>
  );
}
