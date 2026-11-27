import Image from "@/components/common/Image";
import Link from "@/components/common/Link";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useStore } from "@/context/StoreContext";

const EASE = [0.22, 1, 0.36, 1];

export function HeroSection() {
  const reduceMotion = useReducedMotion() ?? false;
  const { setAppointmentOpen } = useStore();
  const stageRef = useRef(null);

  /* Mouse-following 3D tilt for the sunglasses stage */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltX = useSpring(mouseY, { stiffness: 120, damping: 18, mass: 0.5 });
  const tiltY = useSpring(mouseX, { stiffness: 120, damping: 18, mass: 0.5 });

  function handlePointerMove(e) {
    if (reduceMotion) return;
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x * 16);
    tiltX.set(-y * 14);
  }

  function handlePointerLeave() {
    mouseX.set(0);
    tiltX.set(0);
  }

  return (
    <section
      id="home"
      className="hero-vere relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden bg-[#eaf4fa] pt-24 pb-8 sm:pt-28 sm:pb-10 lg:pt-28 lg:pb-12"
    >
      <style>{`
        .hero-vere {
          background: radial-gradient(circle at 68% 58%, #c5e9fb 0%, #daf0fd 28%, #eaf4fa 65%, #f2f8fc 100%);
        }
        .hero-orb-light {
          position: absolute;
          width: 32rem;
          height: 32rem;
          border-radius: 50%;
          background: radial-gradient(circle at center, rgba(162, 222, 252, 0.95) 0%, rgba(193, 235, 254, 0.5) 45%, transparent 72%);
          filter: blur(28px);
          pointer-events: none;
          z-index: 1;
        }
        @media (max-width: 768px) {
          .hero-orb-light {
            width: 20rem;
            height: 20rem;
            filter: blur(20px);
          }
        }
        .hero-sunglass-shadow {
          position: absolute;
          bottom: -18px;
          left: 50%;
          transform: translateX(-50%);
          width: 78%;
          height: 28px;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(15, 23, 42, 0.22) 0%, rgba(15, 23, 42, 0.06) 50%, transparent 75%);
          filter: blur(5px);
          pointer-events: none;
          z-index: 2;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease;
        }
        .hero-sunglass-float {
          animation: vereFloat 7s ease-in-out infinite;
          will-change: transform;
        }
        @keyframes vereFloat {
          0%, 100% {
            transform: translateY(0px) rotate(-0.4deg);
          }
          50% {
            transform: translateY(-12px) rotate(0.6deg);
          }
        }
        .hero-btn-primary {
          background-color: #0d1522;
          color: #ffffff;
          box-shadow: 0 10px 24px -6px rgba(13, 21, 34, 0.35);
          transition: transform 0.28s var(--ease-luxe, cubic-bezier(0.22, 1, 0.36, 1)), box-shadow 0.28s ease, background-color 0.28s ease;
        }
        .hero-btn-primary:hover {
          background-color: #1e293b;
          transform: translateY(-2px);
          box-shadow: 0 14px 30px -6px rgba(13, 21, 34, 0.45);
        }
        .hero-btn-outline {
          background-color: rgba(255, 255, 255, 0.75);
          border: 1px solid rgba(148, 163, 184, 0.45);
          color: #1e293b;
          box-shadow: 0 4px 14px -3px rgba(15, 23, 42, 0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: transform 0.28s var(--ease-luxe, cubic-bezier(0.22, 1, 0.36, 1)), border-color 0.28s ease, background-color 0.28s ease;
        }
        .hero-btn-outline:hover {
          background-color: #ffffff;
          border-color: #94a3b8;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px -4px rgba(15, 23, 42, 0.08);
        }
        .hero-feature-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.55rem 1rem;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.65);
          border: 1px solid rgba(148, 163, 184, 0.25);
          box-shadow: 0 6px 18px -4px rgba(15, 23, 42, 0.04);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          transition: transform 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
        }
        .hero-feature-chip:hover {
          background: rgba(255, 255, 255, 0.95);
          border-color: rgba(148, 163, 184, 0.5);
          transform: translateY(-2px);
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-sunglass-float {
            animation: none;
          }
        }
      `}</style>

      {/* Top Ambient Glow Gradient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/40 to-transparent" />

      {/* Main Container */}
      <div className="container-luxe relative z-10 mx-auto flex flex-1 flex-col items-center justify-center text-center">
        {/* ===================================================================
            1. TYPOGRAPHY HIERARCHY (Centered clean luxury, inspired by Image 2)
           =================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: EASE }}
          className="max-w-3xl"
        >
          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-100/70 px-3.5 py-1 text-[0.55rem] font-bold uppercase tracking-[0.22em] text-sky-900 shadow-sm backdrop-blur-md">
            <Sparkles className="size-3 text-sky-600" />
            <span>Curated Eyewear Atelier · 2026 Collection</span>
          </div>

          {/* Main Headline */}
          <h1 className="mt-4 sm:mt-5 font-sans text-[clamp(2.3rem,5.2vw,4.4rem)] font-extrabold tracking-[-0.035em] text-[#0b1320] leading-[1.04]">
            Framed for how
            <br />
            <span className="text-[#0f172a]">you see the world</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-4 max-w-xl text-[0.88rem] leading-relaxed font-normal text-slate-600 sm:text-[0.96rem]">
            Ayn Care frames are shaped around real lives—lightweight acetate and
            hand-polished hinges for a fit you&apos;ll forget you&apos;re wearing.
          </p>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
            <Link
              href="#collection"
              className="hero-btn-primary flex items-center gap-2 rounded-full px-7 py-3 text-[0.66rem] font-bold uppercase tracking-[0.14em]"
            >
              <span>Shop the edit</span>
              <ArrowRight className="size-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => setAppointmentOpen(true)}
              className="hero-btn-outline flex items-center gap-2 rounded-full px-7 py-3 text-[0.66rem] font-bold uppercase tracking-[0.14em] cursor-pointer"
            >
              <span>Find my fit</span>
              <Sparkles className="size-3.5 text-sky-600" />
            </button>
          </div>
        </motion.div>

        {/* ===================================================================
            2. HERO SUNGLASSES CENTERPIECE (Using Image 1 with glowing orb)
           =================================================================== */}
        <motion.div
          ref={stageRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          className="relative mt-6 sm:mt-8 lg:mt-8 w-full max-w-3xl flex flex-col items-center justify-center"
        >
          {/* Luminous Cyan-Blue Glow Orb situated behind the right lens (matches Image 2) */}
          <div className="hero-orb-light -top-12 sm:-top-16 right-4 sm:right-12 lg:right-20" />

          {/* 3D Interactive & Floating Eyewear Container */}
          <motion.div
            style={{ rotateX: tiltX, rotateY: tiltY }}
            className="relative z-10 w-full max-w-[28rem] sm:max-w-[34rem] lg:max-w-[39rem] px-4 cursor-grab active:cursor-grabbing"
          >
            <div className={reduceMotion ? "" : "hero-sunglass-float"}>
              <div className="relative aspect-[918/318] w-full">
                <Image
                  src="/assets/images/hero-sunglasses-clean.png"
                  alt="Wayfarer Polarized Sunglasses — Signature Edition"
                  fill
                  priority
                  sizes="(max-width: 640px) 95vw, (max-width: 1024px) 80vw, 740px"
                  className="object-contain drop-shadow-[0_24px_38px_rgba(15,23,42,0.28)]"
                />
              </div>
            </div>

            {/* Grounding Contact Shadow */}
            <div className="hero-sunglass-shadow" />
          </motion.div>
        </motion.div>

      </div>

      {/* Bottom transition to catalog */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-black/[0.03]" />
    </section>
  );
}
