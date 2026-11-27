import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const EASE_LUXE = [0.22, 1, 0.36, 1];

export function SitePreloader() {
  const reduceMotion = useReducedMotion() ?? false;
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    if (reduceMotion) {
      setIsDone(true);
      return;
    }

    // Lock page scroll during the luxury intro
    document.body.style.overflow = "hidden";

    // Smoothly animate progress counter from 0% to 100% over ~1.6 seconds
    const duration = 1600;
    const startTime = performance.now();

    let animationFrameId;

    const animateProgress = (currentTime) => {
      const elapsed = currentTime - startTime;
      const rawRatio = Math.min(elapsed / duration, 1);

      // Ease out cubic: starts briskly, smoothly settles into 100%
      const easedProgress = Math.round((1 - Math.pow(1 - rawRatio, 3)) * 100);
      setProgress(easedProgress);

      if (rawRatio < 1) {
        animationFrameId = requestAnimationFrame(animateProgress);
      } else {
        // Hold at 100% for 240ms so the user registers completion, then exit
        setTimeout(() => {
          setIsDone(true);
          document.body.style.overflow = "";
        }, 240);
      }
    };

    animationFrameId = requestAnimationFrame(animateProgress);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.body.style.overflow = "";
    };
  }, [reduceMotion]);

  if (!isMounted) return null;

  return (
    <AnimatePresence mode="wait">
      {!isDone && (
        <motion.div
          key="kousthubam-style-preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            transition: { duration: 0.65, ease: EASE_LUXE },
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050a14] text-white select-none overflow-hidden"
          role="status"
          aria-label="Loading Ayn Care"
        >
          <style>{`
            .luxury-blue-gradient-text {
              background: linear-gradient(90deg, #60a5fa 0%, #38bdf8 28%, #00d2ff 55%, #7dd3fc 82%, #e0f2fe 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            .luxury-blue-gradient-bar {
              background: linear-gradient(90deg, #2563eb 0%, #0284c7 28%, #38bdf8 58%, #7dd3fc 85%, #e0f2fe 100%);
              box-shadow: 0 0 18px rgba(56, 189, 248, 0.65), 0 0 36px rgba(2, 132, 199, 0.4);
            }
          `}</style>

          {/* Ambient Sapphire & Cyan Glow Halo behind the brand title */}
          <div
            className="pointer-events-none absolute w-[30rem] h-[30rem] rounded-full blur-[85px] opacity-35"
            style={{
              background: "radial-gradient(circle, #38bdf8 0%, #0284c7 40%, transparent 70%)",
            }}
          />

          <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-lg">
            {/* 1. Main Brand Title with Electric Sapphire -> Cyan -> Ice White Gradient */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_LUXE }}
              className="luxury-blue-gradient-text font-sans text-[clamp(2.1rem,5vw,3.5rem)] font-bold tracking-tight leading-tight"
            >
              Ayn Care Atelier
            </motion.h1>

            {/* 2. Subtitle Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE_LUXE }}
              className="mt-3 text-sky-200/80 text-sm sm:text-base font-normal tracking-wide"
            >
              Welcome to Luxury
            </motion.p>

            {/* 3. Horizontal Gradient Progress Bar */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0.9 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.3, ease: EASE_LUXE }}
              className="mt-7 w-64 sm:w-80 h-[5px] sm:h-[6px] rounded-full bg-white/10 border border-sky-400/20 overflow-hidden relative"
            >
              <div
                className="luxury-blue-gradient-bar h-full rounded-full transition-all duration-75 ease-out"
                style={{ width: `${progress}%` }}
              />
            </motion.div>

            {/* 4. Live Numerical Percentage Counter (0% -> 100%) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="mt-2.5 text-sky-300/80 text-xs sm:text-[13px] font-mono tracking-wider"
            >
              {progress}%
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
