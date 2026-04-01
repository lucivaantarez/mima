'use client';

// Dynamically imported (ssr: false in page.tsx) — window / AudioContext are safe here.
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Music2 } from 'lucide-react';
import { Howl, Howler } from 'howler';

// ─── Playlist ──────────────────────────────────────────────────────────────────
// Upload files to public/music/ in GitHub, then update src paths below.
const TRACKS = [
  { title: 'Track One',   src: '/music/track1.mp3' },
  { title: 'Track Two',   src: '/music/track2.mp3' },
  { title: 'Track Three', src: '/music/track3.mp3' },
] as const;

const TOTAL_TRACKS = TRACKS.length;
const VOLUME        = 0.75;
const FADE_IN_MS    = 2200;  // gentle auto-start fade after gateway unlock
const CROSSFADE_MS  = 600;   // fast cross-fade on track skip

interface MusicPlayerProps {
  isUnlocked: boolean;
}

// ─── Mini animated waveform ───────────────────────────────────────────────────
function MiniWave({ isActive }: { isActive: boolean }) {
  return (
    <div className="flex items-end gap-[2px] h-[10px]">
      {([0, 0.11, 0.20, 0.05] as const).map((delay, i) => (
        <motion.div
          key={i}
          className="w-[2px] rounded-full"
          style={{ backgroundColor: '#f2a7ca' }}
          animate={isActive ? { height: [3, 9, 3] } : { height: 3 }}
          transition={{
            duration: 0.62,
            repeat: isActive ? Infinity : 0,
            delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function MusicPlayer({ isUnlocked }: MusicPlayerProps) {
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying]   = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Refs — read inside Howl callbacks without stale closure issues
  const howlRef        = useRef<Howl | null>(null);
  const isPlayingRef   = useRef(false);
  const hasAutoStarted = useRef(false);

  // ── Global AudioContext resume on any pointer interaction ───────────────────
  // iOS suspends the AudioContext until a user gesture. Listening here on
  // window (passive) catches any touch anywhere on the page.
  useEffect(() => {
    const resumeCtx = () => {
      if (Howler.ctx && Howler.ctx.state === 'suspended') {
        Howler.ctx.resume();
      }
    };
    window.addEventListener('pointerdown', resumeCtx, { passive: true });
    return () => window.removeEventListener('pointerdown', resumeCtx);
  }, []);

  // ── bfcache "Zombie Audio" fix ───────────────────────────────────────────────
  // When the user navigates back (bfcache restore), the page resumes without
  // running useEffect again. Kill the stale Howl instance so no zombie audio
  // plays in the background on top of a fresh instance.
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted && howlRef.current) {
        howlRef.current.stop();
        howlRef.current.unload();
        howlRef.current = null;
        isPlayingRef.current = false;
        hasAutoStarted.current = false;
        setIsPlaying(false);
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  // ── Unmount cleanup — guaranteed Howl teardown ──────────────────────────────
  useEffect(() => {
    return () => {
      if (howlRef.current) {
        howlRef.current.stop();
        howlRef.current.unload();
        howlRef.current = null;
      }
    };
  }, []);

  // ── Load / reload Howl when trackIndex changes ──────────────────────────────
  useEffect(() => {
    // Tear down the previous Howl before creating a new one
    if (howlRef.current) {
      howlRef.current.stop();
      howlRef.current.unload();
    }

    const track = TRACKS[trackIndex];

    const howl = new Howl({
      src:   [track.src],
      html5: true,    // stream rather than buffer; saves memory on mobile
      volume: 0,
      onend: () => {
        // Auto-advance to next track
        setTrackIndex((prev) => (prev + 1) % TOTAL_TRACKS);
      },
    });

    howlRef.current = howl;

    // Update MediaSession metadata so lock-screen controls show track info
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title:  track.title,
        artist: 'For Mimaa',
        album:  'Saturnity',
      });

      navigator.mediaSession.setActionHandler('previoustrack', () => {
        setTrackIndex((prev) => (prev - 1 + TOTAL_TRACKS) % TOTAL_TRACKS);
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        setTrackIndex((prev) => (prev + 1) % TOTAL_TRACKS);
      });
      navigator.mediaSession.setActionHandler('play', () => {
        if (howlRef.current && !isPlayingRef.current) {
          howlRef.current.play();
          isPlayingRef.current = true;
          setIsPlaying(true);
        }
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        if (howlRef.current && isPlayingRef.current) {
          howlRef.current.pause();
          isPlayingRef.current = false;
          setIsPlaying(false);
        }
      });
    }

    // If we were playing before the track change, resume on the new track
    if (isPlayingRef.current) {
      howl.play();
      howl.fade(0, VOLUME, CROSSFADE_MS);
    }

    return () => {
      howl.stop();
      howl.unload();
    };
  }, [trackIndex]);

  // ── Auto-start with gentle fade on first unlock ─────────────────────────────
  // Chrome Android: dynamic import means MusicPlayer may finish mounting AFTER
  // isUnlocked is already true. We retry once after 300ms if howlRef isn't ready.
  useEffect(() => {
    if (!isUnlocked || hasAutoStarted.current) return;

    const tryStart = () => {
      const howl = howlRef.current;
      if (!howl) return;

      // Resume AudioContext explicitly — Chrome Android requires this
      if (Howler.ctx && Howler.ctx.state === 'suspended') {
        Howler.ctx.resume();
      }

      hasAutoStarted.current = true;
      howl.play();
      howl.fade(0, VOLUME, FADE_IN_MS);
      isPlayingRef.current = true;
      setIsPlaying(true);
      setIsExpanded(true);

      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'playing';
      }
    };

    // Try immediately; if Howl isn't ready yet, retry after 300ms
    if (howlRef.current) {
      tryStart();
    } else {
      const retry = setTimeout(tryStart, 300);
      return () => clearTimeout(retry);
    }
  }, [isUnlocked]);

  // ── Controls ────────────────────────────────────────────────────────────────
  const togglePlay = useCallback(() => {
    const howl = howlRef.current;
    if (!howl) return;

    if (isPlayingRef.current) {
      howl.pause();
      isPlayingRef.current = false;
      setIsPlaying(false);
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'paused';
      }
    } else {
      howl.play();
      isPlayingRef.current = true;
      setIsPlaying(true);
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'playing';
      }
    }
  }, []);

  const goNext = useCallback(() => {
    setTrackIndex((prev) => (prev + 1) % TOTAL_TRACKS);
  }, []);

  const goPrev = useCallback(() => {
    setTrackIndex((prev) => (prev - 1 + TOTAL_TRACKS) % TOTAL_TRACKS);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      {isUnlocked && (
        <motion.div
          className="fixed left-4 z-50"
          // bottom accounts for safe area + a small gap above it
          style={{ bottom: 'calc(env(safe-area-inset-bottom) + 14px)' }}
          initial={{ opacity: 0, y: 18, scale: 0.88 }}
          animate={{ opacity: 1, y: 0,  scale: 1 }}
          exit={{    opacity: 0, y: 18, scale: 0.88 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
        >
          {/* Card — layout-animated for smooth width expand/collapse */}
          <motion.div
            className="glass-pink rounded-2xl overflow-hidden"
            layout
            transition={{ layout: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } }}
          >
            <div className="flex items-center gap-2 p-[10px]">

              {/* Music icon / expand toggle */}
              <button
                onClick={() => setIsExpanded((e) => !e)}
                className="relative w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 focus:outline-none active:opacity-70"
                style={{ background: 'rgba(242,167,202,0.12)', touchAction: 'manipulation' }}
                aria-label="Toggle music player"
              >
                <Music2 size={14} color="#f2a7ca" />

                {/* Pulse ring while playing */}
                {isPlaying && (
                  <motion.span
                    className="absolute inset-0 rounded-full border border-saturn-pink/40 pointer-events-none"
                    animate={{ scale: [1, 1.55], opacity: [0.7, 0] }}
                    transition={{ duration: 1.9, repeat: Infinity }}
                  />
                )}
              </button>

              {/* Expanded track info + controls */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    className="flex items-center gap-2 overflow-hidden"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{   opacity: 0, width: 0 }}
                    transition={{ duration: 0.26, ease: 'easeInOut' }}
                  >
                    {/* Track name + waveform */}
                    <div className="flex flex-col gap-[5px] w-[90px]">
                      <p
                        className="text-white/78 text-[10px] font-light tracking-wide truncate"
                        style={{ fontFamily: '"Exo 2", sans-serif' }}
                      >
                        {TRACKS[trackIndex].title}
                      </p>
                      <MiniWave isActive={isPlaying} />
                    </div>

                    {/* Prev / Play-Pause / Next */}
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={goPrev}
                        className="p-[7px] rounded-full focus:outline-none active:bg-white/10 transition-colors"
                        style={{ touchAction: 'manipulation' }}
                        aria-label="Previous track"
                      >
                        <SkipBack size={12} color="rgba(255,255,255,0.55)" />
                      </button>

                      <button
                        onClick={togglePlay}
                        className="w-[28px] h-[28px] rounded-full flex items-center justify-center flex-shrink-0 focus:outline-none active:opacity-70"
                        style={{ background: 'rgba(242,167,202,0.22)', touchAction: 'manipulation' }}
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying
                          ? <Pause size={11} color="#f2a7ca" />
                          : <Play  size={11} color="#f2a7ca" />
                        }
                      </button>

                      <button
                        onClick={goNext}
                        className="p-[7px] rounded-full focus:outline-none active:bg-white/10 transition-colors"
                        style={{ touchAction: 'manipulation' }}
                        aria-label="Next track"
                      >
                        <SkipForward size={12} color="rgba(255,255,255,0.55)" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
