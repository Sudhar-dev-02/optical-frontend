import Image from "@/components/common/Image";
import Link from "@/components/common/Link";
import { useRef, useState } from "react";
import {
  AnimatePresence,
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
  Award,
  CalendarCheck,
  Check,
  Clock,
  Eye,
  HeartHandshake,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { SITE } from "@/data/site";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/utils/cn";

const EASE = [0.22, 1, 0.36, 1];

export function AboutSection() {
  const reduceMotion = useReducedMotion() ?? false;
  const { setAppointmentOpen } = useStore();
  const sectionRef = useRef(null);
  const sunglassStageRef = useRef(null);

  const [activeStoryTab, setActiveStoryTab] = useState("all");

  /* Scroll-driven rotation for the Ray-Ban sunglasses:
     As user scrolls into and through the section, it rotates from 0deg (horizontal)
     into 90deg (vertical standing upright), matching the reference design video. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  const scrollRotate = useTransform(scrollYProgress, [0.1, 0.95], reduceMotion ? [90, 90] : [0, 90]);
  const scrollScale = useTransform(scrollYProgress, [0.1, 0.95], reduceMotion ? [1, 1] : [0.82, 1]);
  const smoothRotate = useSpring(scrollRotate, { stiffness: 90, damping: 20 });
  const smoothScale = useSpring(scrollScale, { stiffness: 90, damping: 20 });

  /* Interactive pointer parallax for the center stage */
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const tiltX = useSpring(pointerY, { stiffness: 120, damping: 18, mass: 0.4 });
  const tiltY = useSpring(pointerX, { stiffness: 120, damping: 18, mass: 0.4 });

  function handlePointerMove(e) {
    if (reduceMotion) return;
    const stage = sunglassStageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    pointerX.set(x * 14);
    tiltX.set(-y * 12);
  }

  function handlePointerLeave() {
    pointerX.set(0);
    tiltX.set(0);
  }

  return (
    <section
      id="about"
      ref={sectionRef}
      className="about-vere relative isolate overflow-hidden bg-[#eaf4fa] py-20 sm:py-28 lg:py-36 text-slate-900"
    >
      <style>{`
        .about-vere {
          background: radial-gradient(circle at 50% 45%, #c8ebfc 0%, #dbf2fd 30%, #eaf4fa 68%, #f2f8fc 100%);
        }
        .about-orb-light {
          position: absolute;
          width: 28rem;
          height: 28rem;
          border-radius: 50%;
          background: radial-gradient(circle at center, rgba(162, 222, 252, 0.95) 0%, rgba(193, 235, 254, 0.45) 50%, transparent 72%);
          filter: blur(32px);
          pointer-events: none;
          z-index: 1;
        }
        @media (max-width: 768px) {
          .about-orb-light {
            width: 18rem;
            height: 18rem;
            filter: blur(20px);
          }
        }
        .about-sunglass-shadow {
          position: absolute;
          bottom: 12%;
          left: 50%;
          transform: translateX(-50%);
          width: 55%;
          height: 22px;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(15, 23, 42, 0.22) 0%, rgba(15, 23, 42, 0.05) 55%, transparent 75%);
          filter: blur(6px);
          pointer-events: none;
          z-index: 2;
        }
        .about-btn-primary {
          background-color: #0d1522;
          color: #ffffff;
          box-shadow: 0 10px 24px -6px rgba(13, 21, 34, 0.35);
          transition: transform 0.28s var(--ease-luxe, cubic-bezier(0.22, 1, 0.36, 1)), box-shadow 0.28s ease, background-color 0.28s ease;
        }
        .about-btn-primary:hover {
          background-color: #1e293b;
          transform: translateY(-2px);
          box-shadow: 0 14px 30px -6px rgba(13, 21, 34, 0.45);
        }
        .about-btn-outline {
          background-color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(148, 163, 184, 0.45);
          color: #1e293b;
          box-shadow: 0 4px 14px -3px rgba(15, 23, 42, 0.05);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: transform 0.28s var(--ease-luxe, cubic-bezier(0.22, 1, 0.36, 1)), border-color 0.28s ease, background-color 0.28s ease;
        }
        .about-btn-outline:hover {
          background-color: #ffffff;
          border-color: #94a3b8;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px -4px rgba(15, 23, 42, 0.08);
        }
        .about-photo-card {
          position: relative;
          overflow: hidden;
          border-radius: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 20px 45px -12px rgba(15, 23, 42, 0.15);
          background-color: #ffffff;
          transition: transform 0.4s var(--ease-luxe, cubic-bezier(0.22, 1, 0.36, 1)), box-shadow 0.4s ease;
        }
        .about-photo-card:hover {
          transform: translateY(-4px) scale(1.015);
          box-shadow: 0 26px 55px -12px rgba(15, 23, 42, 0.22);
        }
      `}</style>

      {/* Top Ambient Glow Gradient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/40 to-transparent" />

      <div className="container-luxe relative z-10 mx-auto">
        {/* ===================================================================
            3-COLUMN EDITORIAL HERO LAYOUT (Matches reference image)
            Col 1: Heritage & Clinic narrative
            Col 2: Scroll-animated rotating Ray-Ban sunglasses (upright vertical)
            Col 3: Stacked editorial customer photography
           =================================================================== */}
        <div className="grid items-center gap-10 lg:grid-cols-[1.12fr_0.8fr_0.9fr] lg:gap-8 xl:gap-12">
          {/* =================================================================
              COLUMN 1: THE BRAND STORY (Optics India 1996 + Ayn Care)
             ================================================================= */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="flex flex-col text-left"
          >
            {/* Heritage Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/35 bg-white/85 px-4 py-1.5 text-[0.55rem] font-bold uppercase tracking-[0.2em] text-sky-950 shadow-sm backdrop-blur-md w-max">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Ayn Care · A Branch of Optics India</span>
              <span className="text-sky-600 font-semibold">• Est. 1996</span>
            </div>

            {/* Main Section Headline */}
            <h2 className="mt-5 font-sans text-[clamp(2.5rem,4.6vw,4.4rem)] font-extrabold tracking-[-0.035em] text-[#0b1320] leading-[1.04]">
              Built for Clarity.
              <br />
              <span className="text-slate-800">Designed for You.</span>
            </h2>

            {/* Narrative Tabs for Storytelling */}
            <div className="mt-6 flex items-center gap-2 border-b border-slate-300/60 pb-3">
              <button
                type="button"
                onClick={() => setActiveStoryTab("all")}
                className={cn(
                  "rounded-full px-3.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.14em] transition cursor-pointer",
                  activeStoryTab === "all"
                    ? "bg-[#0d1522] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 bg-white/50",
                )}
              >
                Complete Story
              </button>
              <button
                type="button"
                onClick={() => setActiveStoryTab("optics-india")}
                className={cn(
                  "rounded-full px-3.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.14em] transition cursor-pointer",
                  activeStoryTab === "optics-india"
                    ? "bg-[#0d1522] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 bg-white/50",
                )}
              >
                Optics India (1996)
              </button>
              <button
                type="button"
                onClick={() => setActiveStoryTab("ayn-care")}
                className={cn(
                  "rounded-full px-3.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.14em] transition cursor-pointer",
                  activeStoryTab === "ayn-care"
                    ? "bg-[#0d1522] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 bg-white/50",
                )}
              >
                AYN CARE Clinic
              </button>
            </div>

            {/* Content Narrative Box */}
            <div className="mt-5 space-y-4 text-[0.85rem] leading-relaxed text-slate-700 sm:text-[0.92rem]">
              {(activeStoryTab === "all" || activeStoryTab === "optics-india") && (
                <div className="rounded-2xl border border-white/60 bg-white/50 p-4 sm:p-5 shadow-sm backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-[0.6rem] font-bold uppercase tracking-wider text-sky-900 mb-2">
                    <Clock className="size-3.5 text-sky-600" />
                    <span>The Optics India Heritage — Since 1996</span>
                  </div>
                  <p className="text-slate-700">
                    <strong>Optics India</strong> was founded in 1996 by{" "}
                    <strong>A.S. Anwar Basha</strong>, who began this journey with a profound passion
                    for optics and a heartfelt commitment to providing quality eyewear and reliable
                    optical services to the people of Tiruvannamalai.
                  </p>
                  <p className="mt-2 text-slate-600 text-[0.8rem] leading-6">
                    From its early beginnings in precision lens making to becoming a trusted retail
                    optical destination, Optics India has grown through decades of dedication,
                    technical expertise, and deep customer trust. We ensure that every customer
                    receives personalized attention, expert guidance, precise fittings, and lifetime
                    after-sales support.
                  </p>
                </div>
              )}

              {(activeStoryTab === "all" || activeStoryTab === "ayn-care") && (
                <div className="rounded-2xl border border-white/60 bg-white/50 p-4 sm:p-5 shadow-sm backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-[0.6rem] font-bold uppercase tracking-wider text-emerald-900 mb-2">
                    <Eye className="size-3.5 text-emerald-600" />
                    <span>AYN CARE – Eye Clinic & Opticals</span>
                  </div>
                  <p className="text-slate-700">
                    At <strong>AYN CARE</strong>, we carry forward this esteemed heritage with modern
                    clinical optometry. We provide professional eye examinations and comprehensive
                    vision assessments conducted by an experienced and well-trained optometrist,
                    ensuring pinpoint-accurate prescriptions and personalized eye care.
                  </p>
                  <p className="mt-2 text-slate-600 text-[0.8rem] leading-6">
                    We offer an extensive collection of stylish designer frames, prescription
                    contact lenses, and high-performance lenses tailored to suit every vision need,
                    backed by authentic brand warranties and attentive concierge service.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => setAppointmentOpen(true)}
                className="about-btn-primary flex items-center gap-2 rounded-full px-6 py-3 text-[0.65rem] font-bold uppercase tracking-[0.14em] cursor-pointer"
              >
                <span>Book an Eye Exam</span>
                <CalendarCheck className="size-3.5" />
              </button>

              <Link
                href="#collection"
                className="about-btn-outline flex items-center gap-2 rounded-full px-6 py-3 text-[0.65rem] font-bold uppercase tracking-[0.14em]"
              >
                <span>Explore Frames</span>
                <ArrowRight className="size-3.5 text-slate-600" />
              </Link>
            </div>
          </motion.div>

          {/* =================================================================
              COLUMN 2: CENTER RAY-BAN SUNGLASSES (Scroll-Animated Rotation)
              Smoothly rotates 90deg into vertical orientation on scroll
             ================================================================= */}
          <div
            ref={sunglassStageRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            className="relative flex min-h-[460px] sm:min-h-[520px] lg:min-h-[600px] w-full items-center justify-center overflow-visible"
          >
            {/* Cyan glowing circular orb behind the sunglasses (identical to reference image) */}
            <div className="about-orb-light top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

            {/* Scroll-Driven & Interactive Rotated Sunglasses */}
            <motion.div
              style={{
                rotate: smoothRotate,
                scale: smoothScale,
                rotateX: tiltX,
                rotateY: tiltY,
              }}
              className="relative z-10 w-full max-w-[28rem] sm:max-w-[34rem] lg:max-w-[38rem] origin-center cursor-grab active:cursor-grabbing"
            >
              <div className="relative aspect-[918/318] w-full">
                <Image
                  src="/assets/images/hero-sunglasses-clean.png"
                  alt="Curated Polarized Sunglasses — Precision Craftsmanship"
                  fill
                  sizes="(max-width: 1024px) 80vw, 480px"
                  className="object-contain drop-shadow-[0_22px_36px_rgba(15,23,42,0.3)] transition-transform duration-300"
                />
              </div>

              {/* Ambient contact shadow beneath the vertical sunglasses */}
              <div className="about-sunglass-shadow" />
            </motion.div>
          </div>

          {/* =================================================================
              COLUMN 3: STACKED EDITORIAL PHOTOGRAPHY (Matches reference layout)
              Top: Model in stylish sunglasses
              Bottom: Model in optical eyeglasses
             ================================================================= */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            className="flex flex-col gap-4 sm:gap-5"
          >
            {/* Top Photo Card: Sunglasses / Fashion Edit */}
            <div className="about-photo-card aspect-[4/3] sm:aspect-[16/11]">
              <Image
                src="/assets/images/hero_tryon_model.jpg"
                alt="Client styled with premium sunglasses at Ayn Care"
                fill
                sizes="(max-width: 1024px) 90vw, 380px"
                className="object-cover object-top transition duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/10" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex items-end justify-between">
                <div>
                  <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-[0.48rem] font-bold uppercase tracking-wider text-slate-900 shadow-sm backdrop-blur-md">
                    Sun & Polarized
                  </span>
                  <p className="mt-1 font-serif text-lg leading-tight text-white sm:text-xl font-normal">
                    Curated Designer Shades
                  </p>
                </div>
                <span className="grid size-7 place-items-center rounded-full bg-white/20 text-white backdrop-blur-md">
                  <ArrowUpRight className="size-3.5" />
                </span>
              </div>
            </div>

            {/* Bottom Photo Card: Optical Prescription Frames */}
            <div className="about-photo-card aspect-[4/3] sm:aspect-[16/11]">
              <Image
                src="/assets/images/hero_tryon_model_navy.jpg"
                alt="Client styled with optical frames at Ayn Care"
                fill
                sizes="(max-width: 1024px) 90vw, 380px"
                className="object-cover object-center transition duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/10" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex items-end justify-between">
                <div>
                  <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-[0.48rem] font-bold uppercase tracking-wider text-slate-900 shadow-sm backdrop-blur-md">
                    Clinical Eyeglasses
                  </span>
                  <p className="mt-1 font-serif text-lg leading-tight text-white sm:text-xl font-normal">
                    Precision Optical Care
                  </p>
                </div>
                <span className="grid size-7 place-items-center rounded-full bg-white/20 text-white backdrop-blur-md">
                  <ArrowUpRight className="size-3.5" />
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
