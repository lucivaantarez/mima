'use client';

import { motion } from 'framer-motion';

// ─── Photo data ───────────────────────────────────────────────────────────────
// To add your photos: upload to public/images/ in GitHub, then replace the
// src paths below. Captions are optional — add them to the caption field.
interface Photo {
  src: string;
  caption: string;
  fallbackGradient: string;
}

const PHOTOS: Photo[] = [
  {
    src: '/images/photo1.jpg',
    caption: '',
    fallbackGradient: 'linear-gradient(145deg, #12082a 0%, #1e0f3a 100%)',
  },
  {
    src: '/images/photo2.jpg',
    caption: '',
    fallbackGradient: 'linear-gradient(145deg, #081228 0%, #0f1e3a 100%)',
  },
  {
    src: '/images/photo3.jpg',
    caption: '',
    fallbackGradient: 'linear-gradient(145deg, #160820 0%, #280f30 100%)',
  },
  {
    src: '/images/photo4.jpg',
    caption: '',
    fallbackGradient: 'linear-gradient(145deg, #081820 0%, #0f2830 100%)',
  },
  {
    src: '/images/photo5.jpg',
    caption: '',
    fallbackGradient: 'linear-gradient(145deg, #1a0814 0%, #2a0f1e 100%)',
  },
  {
    src: '/images/photo6.jpg',
    caption: '',
    fallbackGradient: 'linear-gradient(145deg, #081a1a 0%, #0f2828 100%)',
  },
];

const CARD_W = 228;
const CARD_H = 304;

// ─── Individual photo card ────────────────────────────────────────────────────
function PhotoCard({ photo, index }: { photo: Photo; index: number }) {
  // Each card drifts at a slightly different speed and amplitude
  const driftAmplitude = 4 + (index % 3); // 4–6px
  const driftDuration  = 3.0 + index * 0.38;
  const driftDelay     = index * 0.42;

  return (
    <motion.div
      className="relative flex-shrink-0 snap-center"
      style={{ width: CARD_W, height: CARD_H }}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.09, duration: 0.65, ease: 'easeOut' }}
    >
      {/* ── Floating wrapper (handles the drift loop) ── */}
      <motion.div
        className="w-full h-full"
        animate={{ y: [0, -driftAmplitude, 0] }}
        transition={{
          duration: driftDuration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: driftDelay,
        }}
      >
        {/* Glass frame */}
        <div
          className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10"
          style={{
            boxShadow:
              '0 14px 44px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.04)',
          }}
        >
          {/* Gradient fallback — always visible as background */}
          <div
            className="absolute inset-0"
            style={{ background: photo.fallbackGradient }}
          />

          {/* Placeholder label (visible when photo isn't loaded yet) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none select-none">
            <p
              className="text-white/[0.06] text-5xl font-extralight"
              style={{ fontFamily: '"Exo 2", sans-serif' }}
            >
              {index + 1}
            </p>
          </div>

          {/* ── Actual photo ── */}
          <img
            src={photo.src}
            alt={photo.caption || `Memory ${index + 1}`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transition: 'opacity 0.5s ease' }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.opacity = '0';
            }}
          />

          {/* Bottom vignette */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/55 to-transparent" />

          {/* Optional caption */}
          {photo.caption ? (
            <p
              className="absolute bottom-3 left-3 right-3 text-[9px] text-white/50 tracking-[0.2em] truncate"
              style={{ fontFamily: '"Exo 2", sans-serif' }}
            >
              {photo.caption}
            </p>
          ) : null}

          {/* Inner pink glow sheen */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ boxShadow: 'inset 0 0 28px rgba(242,167,202,0.035)' }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function PhotoGallery() {
  return (
    <div className="w-full">
      {/* Section label */}
      <p
        className="text-[8px] tracking-[0.5em] text-white/28 uppercase text-center mb-6"
        style={{ fontFamily: '"Exo 2", sans-serif' }}
      >
        us, in frames
      </p>

      {/* ── Horizontal scroll gallery ── */}
      <div
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-5"
        style={{
          paddingLeft: 24,
          paddingRight: 24,
          scrollbarWidth: 'none',
        }}
      >
        {PHOTOS.map((photo, i) => (
          <PhotoCard key={i} photo={photo} index={i} />
        ))}
      </div>

      {/* Scroll-progress dot indicator */}
      <div className="flex items-center justify-center gap-[6px] mt-2">
        {PHOTOS.map((_, i) => (
          <div key={i} className="w-1 h-1 rounded-full bg-white/14" />
        ))}
      </div>
    </div>
  );
}
