import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BRANDS } from "@/data/products";
import { assetUrl } from "@/utils/assetUrl";

const PERSONAS = [
  {
    id: "office",
    personaName: "Professionals",
    title: "Office Professional",
    modelImage: assetUrl("/assets/images/lifestyle-office.png"),
    frameName: "IDEE Executive BlueZero™ Navigator",
    brand: "IDEE",
  },
  {
    id: "students",
    personaName: "Students",
    title: "Students & Youth",
    modelImage: assetUrl("/assets/images/lifestyle-student.png"),
    frameName: "ARCADIO Campus Round Acetate",
    brand: "ARCADIO",
  },
  {
    id: "motorist",
    personaName: "Motorists",
    title: "Motorist & Night Drive",
    modelImage: assetUrl("/assets/images/lifestyle-motorist.png"),
    frameName: "Fastrack DriveSafe Amber Navigator",
    brand: "Fastrack",
  },
  {
    id: "outdoor",
    personaName: "Athletes",
    title: "Outdoor & Sports",
    modelImage: assetUrl("/assets/images/lifestyle-outdoor.png"),
    frameName: "Fastrack Aerodynamic Polarized Wrap",
    brand: "Fastrack",
  },
  {
    id: "kids",
    personaName: "Kids",
    title: "Kids & Teens",
    modelImage: assetUrl("/assets/images/lifestyle-kids.png"),
    frameName: "Infinity Flexi-Kids TR90",
    brand: "Infinity",
  },
  {
    id: "silvers",
    personaName: "Silvers",
    title: "Silvers & Pioneers",
    modelImage: assetUrl("/assets/images/lifestyle-seniors.png"),
    frameName: "Titan Neo Progressive Titanium",
    brand: "Titan",
  },
];

export function BrandLoop() {
  const marqueeItems = [...BRANDS, ...BRANDS];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef(null);
  const total = PERSONAS.length;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-advance turntable every 3.8s, pause on hover
  useEffect(() => {
    if (isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 3800);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, total]);

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const getItemAtOffset = (offset) => {
    const idx = (activeIndex + offset + total * 10) % total;
    return { item: PERSONAS[idx], index: idx, offset };
  };

  const activePersona = PERSONAS[activeIndex];
  const turntableSlots = [
    getItemAtOffset(-2),
    getItemAtOffset(-1),
    getItemAtOffset(0),
    getItemAtOffset(1),
    getItemAtOffset(2),
  ];

  const nearOffset = isMobile ? 105 : 250;
  const farOffset = isMobile ? 195 : 470;

  return (
    <section id="brands" className="relative z-10 overflow-hidden bg-[#eaf4fa] text-slate-900 border-y border-sky-200/50">
      <style>{`
        .brand-marquee-mask {
          mask-image: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
        }
        .brand-marquee-track {
          display: flex;
          width: max-content;
          animation: brandMarquee 32s linear infinite;
          will-change: transform;
        }
        .brand-marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes brandMarquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Theatrical 3D Spotlight Stage */
        .stage-conical-spotlight {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(480px, 92vw);
          height: 100%;
          clip-path: polygon(36% 0%, 64% 0%, 94% 100%, 6% 100%);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.34) 0%, rgba(255, 255, 255, 0.15) 38%, rgba(220, 38, 38, 0.05) 85%, transparent 100%);
          filter: blur(12px);
          pointer-events: none;
          z-index: 2;
        }
        @media (min-width: 640px) {
          .stage-conical-spotlight {
            width: min(680px, 92vw);
            filter: blur(14px);
          }
        }
        .stage-spotlight-source {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 240px;
          height: 70px;
          background: radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.7) 0%, rgba(220, 38, 38, 0.25) 32%, transparent 70%);
          pointer-events: none;
          z-index: 3;
        }
        @media (min-width: 640px) {
          .stage-spotlight-source {
            width: 320px;
            height: 90px;
          }
        }
        .stage-red-pedestal-container {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          width: min(300px, 86vw);
          height: 68px;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          pointer-events: none;
        }
        @media (min-width: 640px) {
          .stage-red-pedestal-container {
            bottom: 20px;
            width: min(440px, 90vw);
            height: 90px;
          }
        }
        .stage-red-pedestal-top {
          width: 100%;
          height: 44px;
          border-radius: 50%;
          background: radial-gradient(ellipse at 50% 40%, #c53047 0%, #9e1f33 55%, #6a1320 100%);
          border: 1.5px solid rgba(255, 190, 200, 0.45);
          box-shadow: inset 0 3px 12px rgba(255, 255, 255, 0.45), 0 0 32px rgba(220, 38, 38, 0.38);
        }
        @media (min-width: 640px) {
          .stage-red-pedestal-top {
            height: 60px;
            box-shadow: inset 0 3px 12px rgba(255, 255, 255, 0.45), 0 0 45px rgba(220, 38, 38, 0.4);
          }
        }
        .stage-red-pedestal-base {
          width: 100%;
          height: 22px;
          margin-top: -22px;
          border-bottom-left-radius: 50% 22px;
          border-bottom-right-radius: 50% 22px;
          background: linear-gradient(180deg, #6a1320 0%, #3a0810 100%);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.95), 0 8px 20px rgba(0, 0, 0, 0.85);
        }
        @media (min-width: 640px) {
          .stage-red-pedestal-base {
            height: 28px;
            margin-top: -30px;
            border-bottom-left-radius: 50% 28px;
            border-bottom-right-radius: 50% 28px;
            box-shadow: 0 30px 65px rgba(0, 0, 0, 0.95), 0 10px 30px rgba(0, 0, 0, 0.85);
          }
        }
        .stage-explore-pill {
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 25;
          padding: 6px 24px;
          border-radius: 9999px;
          background: linear-gradient(180deg, rgba(18, 22, 32, 0.96) 0%, rgba(8, 10, 16, 0.99) 100%);
          border: 1px solid rgba(255, 255, 255, 0.38);
          color: #ffffff;
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.85), 0 0 18px rgba(220, 38, 38, 0.35);
          transition: all 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
          pointer-events: auto;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
        }
        @media (min-width: 640px) {
          .stage-explore-pill {
            bottom: 4px;
            padding: 9px 34px;
            font-size: 11px;
            letter-spacing: 0.22em;
            box-shadow: 0 10px 28px rgba(0, 0, 0, 0.85), 0 0 25px rgba(220, 38, 38, 0.35);
          }
        }
        .stage-explore-pill:hover {
          transform: translateX(-50%) translateY(-2px) scale(1.05);
          border-color: rgba(255, 215, 0, 0.7);
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.95), 0 0 32px rgba(220, 38, 38, 0.55);
          color: #ffe6a3;
        }
        .lifestyle-turntable-viewport {
          position: relative;
          width: 100%;
          height: 350px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          overflow: visible;
          perspective: 1200px;
        }
        @media (min-width: 640px) {
          .lifestyle-turntable-viewport {
            height: 440px;
          }
        }
        @media (min-width: 1024px) {
          .lifestyle-turntable-viewport {
            height: 520px;
          }
        }
        .turntable-model-slot {
          position: absolute;
          bottom: 24px;
          height: 320px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          transition: transform 0.75s cubic-bezier(0.2, 0.8, 0.2, 1),
                      opacity 0.75s cubic-bezier(0.2, 0.8, 0.2, 1),
                      filter 0.75s cubic-bezier(0.2, 0.8, 0.2, 1);
          will-change: transform, opacity, filter;
          cursor: pointer;
        }
        @media (min-width: 640px) {
          .turntable-model-slot {
            bottom: 32px;
            height: 400px;
          }
        }
        @media (min-width: 1024px) {
          .turntable-model-slot {
            bottom: 38px;
            height: 480px;
          }
        }
        .turntable-model-slot img {
          height: 100%;
          max-width: 195px;
          object-fit: contain;
          object-position: bottom center;
          filter: drop-shadow(0 15px 35px rgba(0, 0, 0, 0.85));
          user-select: none;
          pointer-events: none;
          mask-image: linear-gradient(to bottom, black 86%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, black 86%, transparent 100%);
        }
        @media (min-width: 640px) {
          .turntable-model-slot img {
            max-width: 250px;
          }
        }
        @media (min-width: 1024px) {
          .turntable-model-slot img {
            max-width: 290px;
          }
        }
      `}</style>

      {/* 1. TOP HEADER: OUR BRANDS */}
      <div className="container-luxe flex flex-col items-center justify-center text-center pt-6 sm:pt-16 pb-6 sm:pb-10">
        <h2 className="display-serif text-center text-[clamp(2.8rem,5.6vw,4.6rem)] font-normal tracking-[-0.025em] text-[#0b1320] leading-[1.08]">
          Our <span className="italic text-sky-900">Brands</span>
        </h2>
      </div>

      {/* 2. THE BRAND TICKER STRIP */}
      <div className="brand-marquee-mask relative border-y border-sky-200/60 bg-white/40 backdrop-blur-sm py-2">
        <div className="brand-marquee-track">
          {marqueeItems.map((brand, index) => (
            <div
              key={`${brand.name}-${index}`}
              aria-hidden={index >= BRANDS.length}
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(
                    new CustomEvent("filter-brand", { detail: brand.name })
                  );
                }
              }}
              className="group flex w-[16rem] shrink-0 items-center gap-4 border-r border-sky-200/50 px-6 py-6 transition-all duration-300 hover:bg-white hover:shadow-sm sm:w-[20rem] sm:gap-5 sm:px-8 sm:py-8 cursor-pointer"
            >
              {/* Authentic Brand Logo Badge (Replacing placeholder initials) */}
              <span className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl border border-sky-200/80 bg-white p-2.5 shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:border-sky-400 group-hover:shadow-md sm:size-14 sm:p-3">
                {brand.logo ? (
                  <img
                    src={assetUrl(brand.logo)}
                    alt={`${brand.name} official logo`}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <span className="font-sans text-sm font-bold text-sky-900">
                    {brand.mark}
                  </span>
                )}
              </span>
              <span className="min-w-0">
                <span className="block font-sans text-[1.65rem] font-extrabold tracking-[-0.03em] text-[#0b1320] transition-colors duration-300 group-hover:text-sky-950 sm:text-[1.95rem] leading-none">
                  {brand.name}
                </span>
                <span className="mt-1.5 block text-[0.48rem] font-bold uppercase tracking-[0.2em] text-slate-500 transition-colors duration-300 group-hover:text-sky-900 sm:text-[0.54rem]">
                  {brand.note}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================================
          3. THEATRICAL SPOTLIGHT AUTO-SCROLLING 3D STAGE (EXACTLY MATCHING IMAGE)
         ===================================================================== */}
      <div
        className="relative w-full overflow-hidden bg-radial from-[#0d162c] via-[#070b16] to-[#03050a] py-8 sm:py-16 lg:py-24 text-white"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Overhead Conical Spotlight Beam */}
        <div className="stage-conical-spotlight" />
        <div className="stage-spotlight-source" />

        {/* Spotlight Stage Header: "Shop for Professionals" */}
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <h3 className="font-sans text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.025em] text-white">
            Shop for{" "}
            <span className="font-serif italic font-normal text-rose-200">
              {activePersona.personaName}
            </span>
          </h3>
        </div>

        {/* 3D Turntable Stage Container */}
        <div className="relative z-10 mx-auto mt-2 sm:mt-6 flex max-w-7xl flex-col items-center justify-end px-2 sm:px-3">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Lifestyle"
            className="absolute left-1 top-[50%] -translate-y-1/2 z-30 flex size-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md shadow-lg transition duration-200 hover:scale-110 hover:border-white/50 hover:bg-white/20 sm:left-6 sm:size-12 cursor-pointer"
          >
            <ChevronLeft className="size-4.5 sm:size-6 stroke-[2.5]" />
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Lifestyle"
            className="absolute right-1 top-[50%] -translate-y-1/2 z-30 flex size-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md shadow-lg transition duration-200 hover:scale-110 hover:border-white/50 hover:bg-white/20 sm:right-6 sm:size-12 cursor-pointer"
          >
            <ChevronRight className="size-4.5 sm:size-6 stroke-[2.5]" />
          </button>

          {/* 3D Turntable Models Carousel Viewport */}
          <div className="lifestyle-turntable-viewport">
            {turntableSlots.map(({ item, index, offset }) => {
              let translateX = 0;
              let scale = 1.0;
              let opacity = 1.0;
              let zIndex = 10;
              let filter = "none";

              if (offset === 0) {
                // Center model right in the spotlight beam on the red pedestal
                translateX = 0;
                scale = 1.0;
                opacity = 1.0;
                zIndex = 20;
                filter = "contrast(1.06) brightness(1.04)";
              } else if (offset === -1) {
                // Near Left
                translateX = -nearOffset;
                scale = isMobile ? 0.68 : 0.74;
                opacity = isMobile ? 0.44 : 0.52;
                zIndex = 8;
                filter = "brightness(0.7) blur(0.5px)";
              } else if (offset === -2) {
                // Far Left
                translateX = -farOffset;
                scale = isMobile ? 0.46 : 0.52;
                opacity = isMobile ? 0.22 : 0.3;
                zIndex = 4;
                filter = "brightness(0.48) blur(1.5px)";
              } else if (offset === 1) {
                // Near Right
                translateX = nearOffset;
                scale = isMobile ? 0.68 : 0.74;
                opacity = isMobile ? 0.44 : 0.52;
                zIndex = 8;
                filter = "brightness(0.7) blur(0.5px)";
              } else if (offset === 2) {
                // Far Right
                translateX = farOffset;
                scale = isMobile ? 0.46 : 0.52;
                opacity = isMobile ? 0.22 : 0.3;
                zIndex = 4;
                filter = "brightness(0.48) blur(1.5px)";
              }

              return (
                <div
                  key={`${item.id}-${offset}`}
                  className="turntable-model-slot"
                  onClick={() => setActiveIndex(index)}
                  style={{
                    transform: `translateX(${translateX}px) scale(${scale})`,
                    opacity,
                    zIndex,
                    filter,
                  }}
                  title={`Click to view frames for ${item.personaName}`}
                >
                  <img
                    src={item.modelImage}
                    alt={item.title}
                    className="h-full w-auto select-none pointer-events-none"
                  />
                </div>
              );
            })}

            {/* 3D Red Circular Velvet Pedestal Stage */}
            <div className="stage-red-pedestal-container">
              <div className="stage-red-pedestal-top" />
              <div className="stage-red-pedestal-base" />

              {/* Front EXPLORE Pill Button */}
              <a
                href="#collection"
                className="stage-explore-pill"
                title={`Explore curated frames for ${activePersona.personaName}`}
              >
                <span>EXPLORE</span>
              </a>
            </div>
          </div>

          {/* Persona Indicator Selector Tabs */}
          <div className="mt-3.5 sm:mt-8 flex w-full max-w-full items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar px-3 py-1">
            {PERSONAS.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`shrink-0 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 text-[0.52rem] sm:text-[0.58rem] font-bold uppercase tracking-[0.14em] sm:tracking-[0.16em] transition-all duration-300 cursor-pointer ${
                  idx === activeIndex
                    ? "bg-white text-slate-900 shadow-md scale-105"
                    : "border border-white/20 bg-white/5 text-white/60 hover:border-white/40 hover:text-white"
                }`}
              >
                {p.personaName}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
