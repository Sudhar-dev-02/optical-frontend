import { useEffect, useRef, useState } from "react";

/**
 * GlitchCursor
 * Luxury Optical Atelier Custom Cursor featuring RGB split (chromatic aberration),
 * velocity-dependent light dispersion, digital glitch pulses, and an interactive
 * optical target reticle ring.
 */
export function GlitchCursor() {
  const [isTouch, setIsTouch] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const velocity = useRef({ x: 0, y: 0, speed: 0 });
  const glitchOffset = useRef({
    rX: 0,
    rY: 0,
    cX: 0,
    cY: 0,
    bX: 0,
    bY: 0,
    active: false,
  });

  const dotRef = useRef(null);
  const redRef = useRef(null);
  const cyanRef = useRef(null);
  const blueRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Only mount on desktop pointers with fine hover capability
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mediaQuery.matches) {
      setIsTouch(true);
      return;
    }
    setIsTouch(false);

    document.documentElement.classList.add("glitch-cursor-active");

    let lastX = 0;
    let lastY = 0;
    let animId;
    let glitchInterval;

    const onMouseMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      setIsVisible(true);

      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const speed = Math.hypot(dx, dy);

      velocity.current = { x: dx, y: dy, speed };
      lastX = e.clientX;
      lastY = e.clientY;

      // Chromatic flare burst on rapid mouse flick
      if (speed > 14) {
        glitchOffset.current.active = true;
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    // Dynamic hover inspection across all clickable/interactive DOM targets
    const handleMouseOver = (e) => {
      const targetEl = e.target;
      if (
        targetEl &&
        (targetEl.closest("button") ||
          targetEl.closest("a") ||
          targetEl.closest("input") ||
          targetEl.closest("select") ||
          targetEl.closest("textarea") ||
          targetEl.closest('[role="button"]') ||
          targetEl.closest(".cursor-pointer") ||
          window.getComputedStyle(targetEl).cursor === "pointer")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    // Periodic digital glitch jitter pulse
    glitchInterval = setInterval(() => {
      if (Math.random() > 0.4) {
        const magnitude = Math.random() * 7 + 3;
        const angle = Math.random() * Math.PI * 2;
        glitchOffset.current = {
          rX: Math.cos(angle) * magnitude,
          rY: Math.sin(angle) * magnitude * 0.4,
          cX: -Math.cos(angle) * magnitude * 0.9,
          cY: -Math.sin(angle) * magnitude * 0.5,
          bX: Math.sin(angle) * magnitude * 0.6,
          bY: -Math.cos(angle) * magnitude * 0.3,
          active: true,
        };

        setTimeout(() => {
          glitchOffset.current.active = false;
        }, 55);
      }
    }, 450);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // 60-120fps hardware accelerated animation frame
    const render = () => {
      // Smooth linear interpolation for the reticle ring
      const lerp = 0.18;
      pos.current.x += (target.current.x - pos.current.x) * lerp;
      pos.current.y += (target.current.y - pos.current.y) * lerp;

      velocity.current.speed *= 0.88;

      const rX = glitchOffset.current.active
        ? glitchOffset.current.rX
        : -velocity.current.x * 0.22;
      const rY = glitchOffset.current.active
        ? glitchOffset.current.rY
        : -velocity.current.y * 0.14;

      const cX = glitchOffset.current.active
        ? glitchOffset.current.cX
        : velocity.current.x * 0.22;
      const cY = glitchOffset.current.active
        ? glitchOffset.current.cY
        : velocity.current.y * 0.14;

      const bX = glitchOffset.current.active
        ? glitchOffset.current.bX
        : -velocity.current.y * 0.16;
      const bY = glitchOffset.current.active
        ? glitchOffset.current.bY
        : velocity.current.x * 0.16;

      // Exact pointer center
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0)`;
      }

      // Red RGB Channel Layer
      if (redRef.current) {
        redRef.current.style.transform = `translate3d(${target.current.x + rX}px, ${target.current.y + rY}px, 0)`;
      }

      // Cyan RGB Channel Layer
      if (cyanRef.current) {
        cyanRef.current.style.transform = `translate3d(${target.current.x + cX}px, ${target.current.y + cY}px, 0)`;
      }

      // Blue RGB Channel Layer
      if (blueRef.current) {
        blueRef.current.style.transform = `translate3d(${target.current.x + bX}px, ${target.current.y + bY}px, 0)`;
      }

      // Optical Reticle Ring with Spring Scale
      if (ringRef.current) {
        const ringScale = isClicking ? 0.82 : isHovered ? 1.45 : 1;
        ringRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) scale(${ringScale})`;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      document.documentElement.classList.remove("glitch-cursor-active");
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      clearInterval(glitchInterval);
      cancelAnimationFrame(animId);
    };
  }, [isClicking, isHovered]);

  if (isTouch) return null;

  return (
    <>
      <style>{`
        @media (hover: hover) and (pointer: fine) {
          .glitch-cursor-active,
          .glitch-cursor-active * {
            cursor: none !important;
          }
        }
        .glitch-rgb-layer {
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 99999;
          border-radius: 50%;
          will-change: transform;
          mix-blend-mode: screen;
        }
      `}</style>

      <div
        className={`pointer-events-none fixed inset-0 z-[99999] transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        {/* Red RGB Chromatic Aberration */}
        <div
          ref={redRef}
          className="glitch-rgb-layer -ml-1 -mt-1 size-2.5 rounded-full bg-[#ff0055] opacity-80 blur-[0.4px]"
        />

        {/* Cyan RGB Chromatic Aberration */}
        <div
          ref={cyanRef}
          className="glitch-rgb-layer -ml-1 -mt-1 size-2.5 rounded-full bg-[#00ffff] opacity-80 blur-[0.4px]"
        />

        {/* Blue/Violet RGB Chromatic Aberration */}
        <div
          ref={blueRef}
          className="glitch-rgb-layer -ml-1 -mt-1 size-2 rounded-full bg-[#3b82f6] opacity-75 blur-[0.4px]"
        />

        {/* Precision Center Pointer Core */}
        <div
          ref={dotRef}
          className={`glitch-rgb-layer -ml-1 -mt-1 size-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)] transition-transform duration-100 ${
            isClicking ? "scale-75" : isHovered ? "scale-125" : "scale-100"
          }`}
        />

        {/* Trailing Optical Reticle Target */}
        <div
          ref={ringRef}
          className={`fixed left-0 top-0 pointer-events-none z-[99998] -ml-4 -mt-4 size-8 rounded-full border transition-colors duration-200 ${
            isHovered
              ? "border-sky-400 bg-sky-400/15 shadow-[0_0_14px_rgba(56,189,248,0.5)]"
              : "border-slate-800/40"
          }`}
        >
          {/* Optical Crosshair Ticks */}
          <div className="absolute left-1/2 top-0 h-1.5 w-[1px] -translate-x-1/2 bg-sky-400/80" />
          <div className="absolute bottom-0 left-1/2 h-1.5 w-[1px] -translate-x-1/2 bg-sky-400/80" />
          <div className="absolute left-0 top-1/2 h-[1px] w-1.5 -translate-y-1/2 bg-sky-400/80" />
          <div className="absolute right-0 top-1/2 h-[1px] w-1.5 -translate-y-1/2 bg-sky-400/80" />
        </div>
      </div>
    </>
  );
}

