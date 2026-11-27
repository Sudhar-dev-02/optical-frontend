import Image from "@/components/common/Image";
import Link from "@/components/common/Link";
import { useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  Clock,
  Eye,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/utils/cn";

const SPRING_CONFIG = { stiffness: 85, damping: 22, mass: 0.6 };

export function HeroAboutSection() {
  const reduceMotion = useReducedMotion() ?? false;
  const { setAppointmentOpen } = useStore();
  const trackRef = useRef(null);
  const [activeStoryTab, setActiveStoryTab] = useState("all");
  const [isDesktop, setIsDesktop] = useState(true);
  const [viewportWidth, setViewportWidth] = useState(1024);

  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= 1024);
      setViewportWidth(window.innerWidth);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport, { passive: true });
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  /* =========================================================================
     CONTINUOUS SCROLL TRACKING ACROSS HERO & ABOUT US (220vh runway)
     progress 0.00 -> Hero resting at top
     progress 0.12 -> Scroll initiates
     progress 0.12 - 0.50 -> Downward flight & 90deg rotation phase
     progress 0.50 - 0.85 -> About section docked & fully interactive
     progress 0.85 - 1.00 -> Unpins and exits into BrandLoop / Catalog
     ========================================================================= */
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  /* -------------------------------------------------------------------------
     1. SUNGLASSES KINEMATICS (Single Persistent 3D Object)
     ------------------------------------------------------------------------- */
  // 1A. Rotation: 0deg (horizontal in Hero) -> 90deg (vertical in About)
  const rawRotate = useTransform(
    scrollYProgress,
    [0.10, 0.46],
    reduceMotion ? [90, 90] : [0, 90]
  );
  const smoothRotate = useSpring(rawRotate, SPRING_CONFIG);

  // 1B. Vertical translation:
  // In Hero: comfortably positions the sunglasses below the buttons with clear breathing room
  // In About: glides directly into Column 2 center (desktop) or into the right dock beside the paragraph (mobile)
  const heroYPos = isDesktop ? 175 : 156;
  const aboutYPos = isDesktop ? 0 : 46;
  const rawY = useTransform(
    scrollYProgress,
    [0.10, 0.46],
    reduceMotion ? [0, 0] : [heroYPos, aboutYPos]
  );
  const smoothY = useSpring(rawY, SPRING_CONFIG);

  // 1C. Horizontal translation:
  // In Hero: Centered on screen (0px)
  // In About: Aligns with Column 2 on desktop (+42px) or right-side dock beside the paragraph on mobile
  const mobileXPos = Math.round(viewportWidth / 2 - 54);
  const rawX = useTransform(
    scrollYProgress,
    [0.12, 0.46],
    reduceMotion ? [0, 0] : [0, isDesktop ? 42 : mobileXPos]
  );
  const smoothX = useSpring(rawX, SPRING_CONFIG);

  // 1D. Scale:
  // In Hero: 1.0 (refined proportions)
  // In About: 0.88 on desktop, 0.46 on mobile to fit gracefully beside the left-side paragraph card
  const targetScale = isDesktop ? 0.88 : 0.46;
  const rawScale = useTransform(
    scrollYProgress,
    [0.10, 0.46],
    reduceMotion ? [targetScale, targetScale] : [1.0, targetScale]
  );
  const smoothScale = useSpring(rawScale, SPRING_CONFIG);

  /* -------------------------------------------------------------------------
     2. CONTENT CROSS-FADE CHOREOGRAPHY
     ------------------------------------------------------------------------- */
  // Hero text dissolves and lifts upward
  const heroOpacity = useTransform(scrollYProgress, [0.08, 0.28], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0.08, 0.28], [0, -45]);
  const heroPointerEvents = useTransform(scrollYProgress, (p) => (p > 0.24 ? "none" : "auto"));

  // About content enters smoothly from below and locks into place
  const aboutOpacity = useTransform(scrollYProgress, [0.28, 0.50], [0, 1]);
  const aboutY = useTransform(scrollYProgress, [0.28, 0.50], [45, 0]);
  const aboutPointerEvents = useTransform(scrollYProgress, (p) => (p < 0.35 ? "none" : "auto"));

  // Contact shadow morphing:
  // Horizontal ground shadow fades out as glasses rotate;
  // Vertical contact shadow fades in behind the vertical rim
  const horizontalShadow = useTransform(scrollYProgress, [0.12, 0.36], [1, 0]);
  const verticalShadow = useTransform(scrollYProgress, [0.24, 0.48], [0, 1]);

  /* -------------------------------------------------------------------------
     3. 3D POINTER PARALLAX TILT (Interactive micro-physics)
     ------------------------------------------------------------------------- */
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const tiltX = useSpring(pointerY, { stiffness: 120, damping: 18, mass: 0.4 });
  const tiltY = useSpring(pointerX, { stiffness: 120, damping: 18, mass: 0.4 });

  function handlePointerMove(e) {
    if (reduceMotion) return;
    const { innerWidth, innerHeight } = window;
    pointerX.set((e.clientX / innerWidth - 0.5) * 14);
    tiltX.set(-(e.clientY / innerHeight - 0.5) * 12);
  }

  function handlePointerLeave() {
    pointerX.set(0);
    tiltX.set(0);
  }

  return (
    <div
      ref={trackRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="hero-about-wrapper relative min-h-[170vh] lg:min-h-[220vh] -mb-48 sm:-mb-52 lg:mb-0 bg-[#eaf4fa] text-slate-900"
    >
      {/* Anchor targets for navbar links */}
      <div id="home" className="absolute top-0 left-0 h-1 w-1 pointer-events-none" />
      <div id="about" className="absolute top-[48%] left-0 h-1 w-1 pointer-events-none" />

      <style>{`
        .hero-about-stage {
          background: radial-gradient(circle at 65% 42%, #c4e9fb 0%, #daf0fd 28%, #eaf4fa 65%, #f2f8fc 100%);
        }
        .hero-ambient-orb {
          position: absolute;
          width: 32rem;
          height: 32rem;
          border-radius: 50%;
          background: radial-gradient(circle at center, rgba(162, 222, 252, 0.95) 0%, rgba(193, 235, 254, 0.45) 50%, transparent 72%);
          filter: blur(34px);
          pointer-events: none;
          z-index: 1;
        }
        @media (max-width: 768px) {
          .hero-ambient-orb {
            width: 20rem;
            height: 20rem;
            filter: blur(22px);
          }
        }
        .btn-luxe-dark {
          background-color: #0d1522;
          color: #ffffff;
          box-shadow: 0 10px 24px -6px rgba(13, 21, 34, 0.35);
          transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.28s ease, background-color 0.28s ease;
        }
        .btn-luxe-dark:hover {
          background-color: #1e293b;
          transform: translateY(-2px);
          box-shadow: 0 14px 30px -6px rgba(13, 21, 34, 0.45);
        }
        .btn-luxe-outline {
          background-color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(148, 163, 184, 0.45);
          color: #1e293b;
          box-shadow: 0 4px 14px -3px rgba(15, 23, 42, 0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.28s ease, background-color 0.28s ease;
        }
        .btn-luxe-outline:hover {
          background-color: #ffffff;
          border-color: #94a3b8;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px -4px rgba(15, 23, 42, 0.08);
        }
        .editorial-photo-card {
          position: relative;
          overflow: hidden;
          border-radius: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.85);
          box-shadow: 0 20px 45px -12px rgba(15, 23, 42, 0.14);
          background-color: #ffffff;
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease;
        }
        .editorial-photo-card:hover {
          transform: translateY(-4px) scale(1.015);
          box-shadow: 0 26px 55px -12px rgba(15, 23, 42, 0.22);
        }
      `}</style>

      {/* =====================================================================
          STICKY VIEWPORT STAGE (Pinned while user scrubs the 220vh track)
         ===================================================================== */}
      <div className="sticky top-0 h-screen w-full overflow-hidden hero-about-stage flex items-center justify-center">
        {/* Soft Ambient Cyan Backlight Orb */}
        <div className="hero-ambient-orb top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        {/* ===================================================================
            LAYER 1: HERO VIEW (Dissolves & floats upward on scroll)
           =================================================================== */}
        <motion.div
          style={{
            opacity: heroOpacity,
            y: heroY,
            pointerEvents: heroPointerEvents,
          }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-start pt-[5.5rem] sm:pt-[5.75rem] lg:pt-[6rem] px-4 text-center"
        >
          <div className="max-w-3xl lg:max-w-4xl">
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/35 bg-sky-100/80 px-4 py-1.5 text-[0.58rem] sm:text-[0.64rem] font-bold uppercase tracking-[0.22em] text-sky-950 shadow-sm backdrop-blur-md">
              <Sparkles className="size-3.5 text-sky-600" />
              <span>Curated Eyewear Atelier · 2026 Collection</span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-3.5 sm:mt-4 font-sans text-[clamp(2.5rem,5.2vw,4.8rem)] font-extrabold tracking-[-0.035em] text-[#0b1320] leading-[1.02]">
              Framed for how
              <br />
              <span className="text-[#0f172a]">you see the world</span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-3.5 sm:mt-4 max-w-xl text-[0.92rem] leading-relaxed font-normal text-slate-600 sm:text-[1.05rem]">
              Ayn Care frames are shaped around real lives—lightweight acetate and
              hand-polished hinges for a fit you&apos;ll forget you&apos;re wearing.
            </p>

            {/* Action Buttons */}
            <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
              <Link
                href="#collection"
                className="btn-luxe-dark flex items-center gap-2.5 rounded-full px-7 py-3 text-[0.70rem] sm:text-[0.75rem] font-bold uppercase tracking-[0.15em]"
              >
                <span>Shop the edit</span>
                <ArrowRight className="size-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => setAppointmentOpen(true)}
                className="btn-luxe-outline flex items-center gap-2.5 rounded-full px-7 py-3 text-[0.70rem] sm:text-[0.75rem] font-bold uppercase tracking-[0.15em] cursor-pointer"
              >
                <span>Find my fit</span>
                <Sparkles className="size-3.5 text-sky-600" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* ===================================================================
            LAYER 2: ABOUT US 3-COLUMN EDITORIAL (Emerges from below on scroll)
           =================================================================== */}
        <motion.div
          style={{
            opacity: aboutOpacity,
            y: aboutY,
            pointerEvents: aboutPointerEvents,
          }}
          className="absolute inset-0 z-20 flex items-center justify-center pt-16 lg:pt-0 px-4 sm:px-6 lg:px-12"
        >
          <div className="container-luxe mx-auto grid items-center gap-8 lg:grid-cols-[1.14fr_0.75fr_0.9fr] lg:gap-8 xl:gap-12 w-full">
            {/* COLUMN 1: THE BRAND STORY (Optics India 1996 + Ayn Care) */}
            <div className="flex flex-col text-left w-full">
              {/* Heritage Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/35 bg-white/85 px-3.5 py-1 text-[0.52rem] sm:text-[0.55rem] font-bold uppercase tracking-[0.2em] text-sky-950 shadow-sm backdrop-blur-md w-max">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Ayn Care · A Branch of Optics India</span>
                <span className="text-sky-600 font-semibold">• Est. 1996</span>
              </div>

              {/* Main Headline */}
              <h2 className="mt-2.5 sm:mt-4 font-sans text-[clamp(1.75rem,4.4vw,3.9rem)] font-extrabold tracking-[-0.035em] text-[#0b1320] leading-[1.05]">
                Built for Clarity.
                <br />
                <span className="text-slate-800">Designed for You.</span>
              </h2>

              {/* Narrative Tabs */}
              <div className="mt-3 sm:mt-5 flex items-center gap-1.5 sm:gap-2 border-b border-slate-300/60 pb-2 sm:pb-3 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveStoryTab("all")}
                  className={cn(
                    "rounded-full px-2.5 sm:px-3 py-1 text-[0.54rem] sm:text-[0.58rem] font-bold uppercase tracking-[0.12em] sm:tracking-[0.14em] transition cursor-pointer shrink-0 whitespace-nowrap",
                    activeStoryTab === "all"
                      ? "bg-[#0d1522] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 bg-white/50"
                  )}
                >
                  <span className="sm:hidden">All</span>
                  <span className="hidden sm:inline">Complete Story</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStoryTab("optics-india")}
                  className={cn(
                    "rounded-full px-2.5 sm:px-3 py-1 text-[0.54rem] sm:text-[0.58rem] font-bold uppercase tracking-[0.12em] sm:tracking-[0.14em] transition cursor-pointer shrink-0 whitespace-nowrap",
                    activeStoryTab === "optics-india"
                      ? "bg-[#0d1522] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 bg-white/50"
                  )}
                >
                  <span className="sm:hidden">Optics India</span>
                  <span className="hidden sm:inline">Optics India (1996)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStoryTab("ayn-care")}
                  className={cn(
                    "rounded-full px-2.5 sm:px-3 py-1 text-[0.54rem] sm:text-[0.58rem] font-bold uppercase tracking-[0.12em] sm:tracking-[0.14em] transition cursor-pointer shrink-0 whitespace-nowrap",
                    activeStoryTab === "ayn-care"
                      ? "bg-[#0d1522] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 bg-white/50"
                  )}
                >
                  <span className="sm:hidden">AYN Care</span>
                  <span className="hidden sm:inline">AYN CARE Clinic</span>
                </button>
              </div>

              {/* Story Narrative Box */}
              <div className="mt-2.5 sm:mt-4">
                {/* MOBILE VIEW (lg:hidden): Paragraph on Left Side, Sunglasses Dock on Right Side */}
                <div className="flex lg:hidden flex-row items-center gap-2.5 w-full">
                  {/* Left Side: Story Card Paragraph */}
                  <div className="flex-1 min-w-0">
                    {activeStoryTab === "all" && (
                      <div className="rounded-2xl border border-white/60 bg-white/65 p-2.5 sm:p-3.5 shadow-sm backdrop-blur-sm text-[0.70rem] sm:text-[0.76rem] leading-relaxed text-slate-700">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="relative size-8 sm:size-9 rounded-full overflow-hidden border-1.5 border-sky-400/60 shadow-sm shrink-0">
                            <Image
                              src="/assets/images/founder_anwar_basha.jpg"
                              alt="A.S. Anwar Basha — Founder"
                              fill
                              sizes="36px"
                              className="object-cover"
                              style={{ objectPosition: "center 38%" }}
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1 text-[0.50rem] sm:text-[0.56rem] font-bold uppercase tracking-wider text-sky-900">
                              <Clock className="size-2.5 sm:size-3 text-sky-600 shrink-0" />
                              <span className="truncate">Optics India · Est. 1996</span>
                            </div>
                            <p className="text-[0.62rem] sm:text-[0.68rem] font-bold text-slate-900 truncate">
                              A.S. Anwar Basha, Founder
                            </p>
                          </div>
                        </div>
                        <p>
                          Founded in 1996 by <strong>A.S. Anwar Basha</strong>, Optics India has grown through decades of dedicated lens crafting. At <strong>AYN CARE</strong>, we pair this heritage with modern optometry and bespoke styling.
                        </p>
                      </div>
                    )}

                    {activeStoryTab === "optics-india" && (
                      <div className="rounded-2xl border border-white/60 bg-white/65 p-2.5 sm:p-3.5 shadow-sm backdrop-blur-sm text-[0.70rem] sm:text-[0.76rem] leading-relaxed text-slate-700">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="relative size-8 sm:size-9 rounded-full overflow-hidden border-1.5 border-sky-400/60 shadow-sm shrink-0">
                            <Image
                              src="/assets/images/founder_anwar_basha.jpg"
                              alt="A.S. Anwar Basha — Founder"
                              fill
                              sizes="36px"
                              className="object-cover"
                              style={{ objectPosition: "center 38%" }}
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1 text-[0.50rem] sm:text-[0.56rem] font-bold uppercase tracking-wider text-sky-900">
                              <Clock className="size-2.5 sm:size-3 text-sky-600 shrink-0" />
                              <span className="truncate">Optics India · Since 1996</span>
                            </div>
                            <p className="text-[0.62rem] sm:text-[0.68rem] font-bold text-slate-900 truncate">
                              A.S. Anwar Basha, Founder
                            </p>
                          </div>
                        </div>
                        <p>
                          <strong>Optics India</strong> was founded in 1996 by <strong>A.S. Anwar Basha</strong>, dedicated to quality eyewear and precision optical craft in Tiruvannamalai.
                        </p>
                      </div>
                    )}

                    {activeStoryTab === "ayn-care" && (
                      <div className="rounded-2xl border border-white/60 bg-white/65 p-2.5 sm:p-3.5 shadow-sm backdrop-blur-sm text-[0.70rem] sm:text-[0.76rem] leading-relaxed text-slate-700">
                        <div className="flex items-center gap-1.5 text-[0.54rem] sm:text-[0.58rem] font-bold uppercase tracking-wider text-emerald-900 mb-1">
                          <Eye className="size-3 text-emerald-600 shrink-0" />
                          <span className="truncate">AYN CARE – Eye Clinic & Opticals</span>
                        </div>
                        <p>
                          At <strong>AYN CARE</strong>, we carry forward this esteemed heritage with modern clinical optometry, comprehensive 12-step corneal vision tests, and personalized optical styling.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Side: Dedicated Vertical Slot for the 90deg Sunglasses */}
                  <div className="w-[74px] sm:w-[82px] h-[155px] sm:h-[165px] shrink-0 pointer-events-none flex items-center justify-center" />
                </div>

                {/* DESKTOP VIEW (hidden lg:block): Original dual card editorial */}
                <div className="hidden lg:block space-y-3.5 text-[0.78rem] leading-relaxed text-slate-700 sm:text-[0.88rem]">
                  {activeStoryTab === "all" && (
                    <>
                      <div className="rounded-2xl border border-white/60 bg-white/55 p-4 sm:p-5 shadow-sm backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2.5">
                          <div className="relative size-11 rounded-full overflow-hidden border-2 border-sky-400/60 shadow-sm shrink-0">
                            <Image
                              src="/assets/images/founder_anwar_basha.jpg"
                              alt="A.S. Anwar Basha — Founder"
                              fill
                              sizes="44px"
                              className="object-cover"
                              style={{ objectPosition: "center 38%" }}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 text-[0.58rem] font-bold uppercase tracking-wider text-sky-900">
                              <Clock className="size-3 text-sky-600 shrink-0" />
                              <span>The Optics India Heritage — Since 1996</span>
                            </div>
                            <p className="text-[0.74rem] font-bold text-slate-900">
                              A.S. Anwar Basha, Founder
                            </p>
                          </div>
                        </div>
                        <p>
                          <strong>Optics India</strong> was founded in 1996 by <strong>A.S. Anwar Basha</strong>, who began with a heartfelt commitment to providing quality eyewear and reliable optical precision to the people of Tiruvannamalai.
                        </p>
                        <p className="mt-1.5 text-slate-600 text-[0.78rem] leading-5">
                          From precision lens crafting to a premier retail optical destination, we provide dedicated optometrist guidance, personalized frame fittings, and lifetime after-sales care.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/60 bg-white/55 p-4 sm:p-5 shadow-sm backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-[0.6rem] font-bold uppercase tracking-wider text-emerald-900 mb-1.5">
                          <Eye className="size-3.5 text-emerald-600" />
                          <span>AYN CARE – Eye Clinic & Opticals</span>
                        </div>
                        <p>
                          At <strong>AYN CARE</strong>, we carry forward this esteemed heritage with modern clinical optometry, comprehensive 12-step corneal vision tests, and personalized optical styling.
                        </p>
                      </div>
                    </>
                  )}

                  {activeStoryTab === "optics-india" && (
                    <div className="rounded-2xl border border-white/60 bg-white/55 p-3.5 sm:p-5 shadow-sm backdrop-blur-sm">
                      <div className="flex items-center gap-2 text-[0.6rem] font-bold uppercase tracking-wider text-sky-900 mb-1.5">
                        <Clock className="size-3.5 text-sky-600" />
                        <span>The Optics India Heritage — Since 1996</span>
                      </div>
                      <p>
                        <strong>Optics India</strong> was founded in 1996 by <strong>A.S. Anwar Basha</strong>, who began with a heartfelt commitment to providing quality eyewear and reliable optical precision to the people of Tiruvannamalai.
                      </p>
                      <p className="mt-1.5 text-slate-600 text-[0.76rem] sm:text-[0.78rem] leading-5">
                        From precision lens crafting to a premier retail optical destination, we provide dedicated optometrist guidance, personalized frame fittings, and lifetime after-sales care.
                      </p>
                    </div>
                  )}

                  {activeStoryTab === "ayn-care" && (
                    <div className="rounded-2xl border border-white/60 bg-white/55 p-3.5 sm:p-5 shadow-sm backdrop-blur-sm">
                      <div className="flex items-center gap-2 text-[0.6rem] font-bold uppercase tracking-wider text-emerald-900 mb-1.5">
                        <Eye className="size-3.5 text-emerald-600" />
                        <span>AYN CARE – Eye Clinic & Opticals</span>
                      </div>
                      <p>
                        At <strong>AYN CARE</strong>, we carry forward this esteemed heritage with modern clinical optometry, comprehensive 12-step corneal vision tests, and personalized optical styling.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons (Side-by-side on mobile, equal height and zero text wrap) */}
              <div className="mt-3.5 sm:mt-5 flex flex-row items-center gap-2.5 sm:gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setAppointmentOpen(true)}
                  className="btn-luxe-dark h-11 sm:h-12 flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 rounded-full px-3.5 sm:px-6 text-[0.56rem] sm:text-[0.64rem] font-bold uppercase tracking-[0.12em] sm:tracking-[0.14em] whitespace-nowrap cursor-pointer"
                >
                  <span className="whitespace-nowrap">Book an Exam</span>
                  <CalendarCheck className="size-3.5 shrink-0" />
                </button>

                <Link
                  href="#collection"
                  className="btn-luxe-outline h-11 sm:h-12 flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 rounded-full px-3.5 sm:px-6 text-[0.56rem] sm:text-[0.64rem] font-bold uppercase tracking-[0.12em] sm:tracking-[0.14em] whitespace-nowrap"
                >
                  <span className="whitespace-nowrap">Explore</span>
                  <ArrowRight className="size-3.5 shrink-0 text-slate-600" />
                </Link>
              </div>
            </div>

            {/* COLUMN 2: EMPTY ANCHOR DOCK
                (The physical sunglasses float directly into this column slot via spring physics) */}
            <div className="hidden lg:flex h-[520px] w-full items-center justify-center pointer-events-none" />

            {/* COLUMN 3: STACKED EDITORIAL PHOTOGRAPHY */}
            <div className="hidden lg:flex flex-col gap-4">
              {/* Top Photo Card: Founder Heritage Portrait */}
              <div className="editorial-photo-card aspect-[16/11]">
                <Image
                  src="/assets/images/founder_anwar_basha.jpg"
                  alt="A.S. Anwar Basha — Founder of Optics India & Ayn Care"
                  fill
                  sizes="360px"
                  className="object-cover transition duration-700 hover:scale-105"
                  style={{ objectPosition: "center 42%" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex items-end justify-between">
                  <div>
                    <span className="rounded-full bg-sky-500/90 text-white px-2.5 py-0.5 text-[0.48rem] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md">
                      Founder · Est. 1996
                    </span>
                    <p className="mt-1 font-serif text-lg leading-tight text-white font-normal">
                      A.S. Anwar Basha
                    </p>
                    <p className="text-[0.66rem] text-slate-300 font-sans mt-0.5">
                      Founder, Optics India & AYN Care
                    </p>
                  </div>
                  <span className="grid size-7 place-items-center rounded-full bg-white/20 text-white backdrop-blur-md">
                    <ArrowUpRight className="size-3.5" />
                  </span>
                </div>
              </div>

              {/* Bottom Photo Card: Optical Prescription Frames */}
              <div className="editorial-photo-card aspect-[16/11]">
                <Image
                  src="/assets/images/hero_tryon_model_navy.jpg"
                  alt="Client styled with optical frames at Ayn Care"
                  fill
                  sizes="360px"
                  className="object-cover object-center transition duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/10" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex items-end justify-between">
                  <div>
                    <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-[0.48rem] font-bold uppercase tracking-wider text-slate-900 shadow-sm backdrop-blur-md">
                      Clinical Eyeglasses
                    </span>
                    <p className="mt-1 font-serif text-lg leading-tight text-white font-normal">
                      Precision Optical Care
                    </p>
                  </div>
                  <span className="grid size-7 place-items-center rounded-full bg-white/20 text-white backdrop-blur-md">
                    <ArrowUpRight className="size-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ===================================================================
            LAYER 3: THE PERSISTENT SPATIAL SUNGLASSES RIG
            Continuous 3D object that rotates 90deg and glides downward into About
           =================================================================== */}
        <motion.div
          style={{
            x: smoothX,
            y: smoothY,
            rotate: smoothRotate,
            scale: smoothScale,
            rotateX: tiltX,
            rotateY: tiltY,
          }}
          className="absolute z-30 pointer-events-none flex items-center justify-center w-[16rem] sm:w-[22rem] md:w-[28rem] lg:w-[34rem] xl:w-[36rem] aspect-square"
        >
          <div className="relative w-full aspect-[918/318]">
            {/* The Glasses Image Asset */}
            <Image
              src="/assets/images/hero-sunglasses-clean.png"
              alt="Curated Polarized Sunglasses — Signature Edition"
              fill
              priority
              sizes="(max-width: 640px) 95vw, (max-width: 1024px) 80vw, 560px"
              className="object-contain drop-shadow-[0_24px_38px_rgba(15,23,42,0.28)]"
            />

            {/* Dynamic Horizontal Ground Contact Shadow (Visible in Hero horizontal state) */}
            <motion.div
              style={{ opacity: horizontalShadow }}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[76%] h-7 rounded-full bg-slate-950/22 blur-md pointer-events-none"
            />

            {/* Dynamic Vertical Contact Shadow (Visible in About vertical 90deg state) */}
            <motion.div
              style={{ opacity: verticalShadow }}
              className="absolute top-1/2 -right-6 -translate-y-1/2 w-7 h-[72%] rounded-full bg-slate-950/25 blur-md pointer-events-none"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Export both named variants for maximum compatibility
export const HeroAboutExperience = HeroAboutSection;
