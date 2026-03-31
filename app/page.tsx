'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import CosmicGateway   from '@/components/CosmicGateway';
import DiscordGenesis  from '@/components/DiscordGenesis';
import PhotoAlbum      from '@/components/PhotoAlbum';
import PoemSymphony    from '@/components/PoemSymphony';
import SaturnityLetter from '@/components/SaturnityLetter';
import FinalQuestion   from '@/components/FinalQuestion';
import AudioSystem     from '@/components/AudioSystem';
import SuccessState    from '@/components/SuccessState';

/* ── Small structural helpers ───────────────────────────────── */
function SectionEntry({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden:  { opacity: 0, y: 30 },
        visible: {
          opacity: 1, y: 0,
          transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

function GradientDivider({ reverse = false }: { reverse?: boolean }) {
  return (
    <motion.div
      className="mx-5 h-px"
      style={{
        background: reverse
          ? 'linear-gradient(90deg, transparent, rgba(143,184,237,0.25), rgba(242,167,202,0.25), transparent)'
          : 'linear-gradient(90deg, transparent, rgba(242,167,202,0.25), rgba(143,184,237,0.25), transparent)',
      }}
      variants={{
        hidden:  { opacity: 0, scaleX: 0 },
        visible: {
          opacity: 1, scaleX: 1,
          transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    />
  );
}

/* ── Root page ──────────────────────────────────────────────── */
export default function HomePage() {
  const [unlocked, setUnlocked] = useState(false);
  const [success,  setSuccess]  = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <main className="relative min-h-[100dvh] bg-saturn-space overflow-hidden">

      {/* Audio — fades in after unlock */}
      <AudioSystem active={unlocked} />

      <AnimatePresence mode="wait">

        {/* ── GATEWAY ──────────────────────────────────────── */}
        {!unlocked && (
          <motion.div
            key="gateway"
            className="absolute inset-0"
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
          >
            <CosmicGateway onUnlocked={() => setUnlocked(true)} />
          </motion.div>
        )}

        {/* ── MAIN SCROLL EXPERIENCE ───────────────────────── */}
        {unlocked && !success && (
          <motion.div
            key="content"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div
              ref={scrollRef}
              className="h-[100dvh] overflow-y-auto overflow-x-hidden"
              style={{
                paddingTop:     'max(env(safe-area-inset-top), 1.5rem)',
                paddingBottom:  'max(env(safe-area-inset-bottom), 3rem)',
                scrollbarWidth: 'none',
              }}
            >
              <motion.div
                className="flex flex-col gap-12"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden:  {},
                  visible: { transition: { staggerChildren: 0.15 } },
                }}
              >
                {/* ── Page header ──────────────────────────── */}
                <motion.div
                  className="px-5 pt-2"
                  variants={{
                    hidden:  { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1, y: 0,
                      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                >
                  <h1 className="text-white/20 text-[9px] tracking-[0.5em] uppercase">
                    Project Saturnity
                  </h1>
                  <p className="text-white/60 text-xl font-extralight tracking-[0.15em] mt-1">
                    Our Universe
                  </p>
                </motion.div>

                {/* ① Discord Genesis ───────────────────────── */}
                <SectionEntry>
                  <DiscordGenesis />
                </SectionEntry>

                <GradientDivider />

                {/* ② Photo Album ───────────────────────────── */}
                <SectionEntry>
                  <PhotoAlbum scrollRef={scrollRef} />
                </SectionEntry>

                <GradientDivider reverse />

                {/* ③ Poem — Symphony ───────────────────────── */}
                <SectionEntry>
                  <PoemSymphony containerRef={scrollRef} />
                </SectionEntry>

                <GradientDivider />

                {/* ④ Letter — Saturnity ────────────────────── */}
                <SectionEntry>
                  <SaturnityLetter containerRef={scrollRef} />
                </SectionEntry>

                <GradientDivider reverse />

                {/* ⑤ The Final Question ────────────────────── */}
                <SectionEntry>
                  <FinalQuestion onYes={() => setSuccess(true)} />
                </SectionEntry>

                {/* Bottom breathing room */}
                <div className="h-8" />

              </motion.div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* ── SUCCESS STATE — layered on top ─────────────────── */}
      <AnimatePresence>
        {success && <SuccessState />}
      </AnimatePresence>

    </main>
  );
}

