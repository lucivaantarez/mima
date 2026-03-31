'use client';

import {
  useRef,
  useState,
  useCallback,
} from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion';

/* ── Placeholder photo data ───────────────────────────────── */
/*
   Replace `gradient` with real <img src="..."> once you have assets.
   `tilt` is the Polaroid rotation in degrees.
   `speed` controls the parallax intensity (higher = floats more).
   `offset` staggers the initial Y position.
*/
interface PhotoData {
  id: number;
  caption: string;
  tilt: number;
  speed: number;       // parallax multiplier
  align: 'left' | 'right' | 'center';
  gradient: string;    // placeholder background
  aspect: string;      // Tailwind aspect class
  date: string;
}

const PHOTOS: PhotoData[] = [
  {
    id: 1,
    caption: 'the first time the stars felt closer',
    tilt: -3.5,
    speed: 0.6,
    align: 'left',
    gradient: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #f2a7ca22 100%)',
    aspect: 'aspect-[3/4]',
    date: '∞',
  },
  {
    id: 2,
    caption: 'warm voice, cold night',
    tilt: 4,
    speed: 0.85,
    align: 'right',
    gradient: 'linear-gradient(145deg, #0a1628 0%, #1c3354 50%, #8fb8ed22 100%)',
    aspect: 'aspect-square',
    date: '∞',
  },
  {
    id: 3,
    caption: 'orbit accepted',
    tilt: -2,
    speed: 0.5,
    align: 'center',
    gradient: 'linear-gradient(160deg, #0d0d1e 0%, #1a0f2e 40%, #f2a7ca18 70%, #8fb8ed18 100%)',
    aspect: 'aspect-[4/3]',
    date: '∞',
  },
  {
    id: 4,
    caption: 'u were cute, warm, calm',
    tilt: 3.5,
    speed: 0.7,
    align: 'left',
    gradient: 'linear-gradient(120deg, #12081e 0%, #261040 50%, #f2a7ca30 100%)',
    aspect: 'aspect-[3/4]',
    date: '∞',
  },
  {
    id: 5,
    caption: 'HAHAHHAHA (i meant it)',
    tilt: -4.5,
    speed: 0.9,
    align: 'right',
    gradient: 'linear-gradient(150deg, #080818 0%, #0f1a30 50%, #8fb8ed30 100%)',
    aspect: 'aspect-square',
    date: '∞',
  },
  {
    id: 6,
    caption: 'mine, forever',
    tilt: 2,
    speed: 0.65,
    align: 'center',
    gradient: 'linear-gradient(135deg, #0a050f 0%, #1e0a28 40%, #f2a7ca20 60%, #8fb8ed20 100%)',
    aspect: 'aspect-[3/4]',
    date: '∞',
  },
];

/* ── Individual Polaroid card ─────────────────────────────── */
function Polaroid({
  photo,
  containerRef,
}: {
  photo: PhotoData;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    container: containerRef,
    offset: ['start end', 'end start'],
  });

  /* Smooth spring wrapping the raw scroll value */
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001,
  });

  /* Each card floats up at its own speed */
  const y = useTransform(
    smoothProgress,
    [0, 1],
    [60 * photo.speed, -80 * photo.speed]
  );

  /* Subtle scale-in as it enters viewport */
  const scale = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.88, 1, 1, 0.92]);
  const opacity = useTransform(smoothProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  const alignClass =
    photo.align === 'left'
      ? 'mr-auto ml-3'
      : photo.align === 'right'
      ? 'ml-auto mr-3'
      : 'mx-auto';

  /* Width varies slightly for visual rhythm */
  const widthClass =
    photo.align === 'center' ? 'w-[72%]' : 'w-[62%]';

  return (
    <motion.div
      ref={ref}
      className={`${alignClass} ${widthClass} shrink-0`}
      style={{ y, scale, opacity, rotate: photo.tilt }}
    >
      {/* Polaroid frame */}
      <div
        className="rounded-sm overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow:
            '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.08)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Photo area */}
        <div
          className={`w-full ${photo.aspect} relative overflow-hidden`}
          style={{ background: photo.gradient }}
        >
          {/* Faint grain texture overlay */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'[w3.org](http://www.w3.org/2000/svg\)'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")',
              backgroundSize: '120px',
            }}
          />

          {/* Decorative light leak */}
          <div
            className="absolute top-0 left-0 w-1/2 h-1/3 opacity-20"
            style={{
              background:
                'radial-gradient(ellipse at 0% 0%, #f2a7ca 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-1/2 h-1/3 opacity-15"
            style={{
              background:
                'radial-gradient(ellipse at 100% 100%, #8fb8ed 0%, transparent 70%)',
            }}
          />

          {/* Center glyph — replace with real <img> */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/10 text-4xl select-none">✦</span>
          </div>
        </div>

        {/* Caption strip */}
        <div className="px-3 py-2.5 bg-white/[0.02]">
          <p
            className="text-white/55 leading-snug"
            style={{
              fontSize: 10,
              fontStyle: 'italic',
              letterSpacing: '0.03em',
              fontWeight: 300,
            }}
          >
            {photo.caption}
          </p>
          <p
            className="text-white/20 mt-1"
            style={{ fontSize: 8, letterSpacing: '0.15em' }}
          >
            {photo.date}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Album header ─────────────────────────────────────────── */
function AlbumHeader() {
  return (
    <div className="px-5 pt-2 pb-4">
      <p className="text-[9px] tracking-[0.35em] text-white/30 uppercase mb-1">
        Memory · Fragments
      </p>
      <h2 className="text-white/70 text-sm font-extralight tracking-[0.2em] uppercase">
        Photo Album
      </h2>
    </div>
  );
}

/* ── Main export ──────────────────────────────────────────── */
export default function PhotoAlbum({
  scrollRef,
}: {
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <section className="w-full">
      <AlbumHeader />

      {/* Staggered photo column */}
      <div className="flex flex-col gap-8 pb-8 px-2">
        {PHOTOS.map((photo, i) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.1 * i,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <Polaroid photo={photo} containerRef={scrollRef} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

