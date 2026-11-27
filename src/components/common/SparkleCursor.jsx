import { useEffect, useRef } from "react";

/**
 * SparkleCursor
 * High-performance, high-DPI canvas cursor animation.
 * Features radiant 4-pointed luxury diamond stars (✦), golden optical glints,
 * velocity-responsive constellation trails, and interactive click bursts.
 */
export function SparkleCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Only activate on devices with fine pointer and hover support (desktop)
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mediaQuery.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Particle pool
    const particles = [];
    const maxParticles = 90;

    // Palette: Champagne gold, diamond white, and sky crystal glints
    const colors = [
      { r: 255, g: 255, b: 255 }, // Diamond white
      { r: 245, g: 228, b: 195 }, // Pale champagne
      { r: 226, g: 190, b: 122 }, // Atelier gold
      { r: 196, g: 154, b: 88 },  // Deep gold
      { r: 186, g: 230, b: 253 }, // Soft sky blue
      { r: 125, g: 211, b: 252 }, // Sky crystal
    ];

    let lastX = -100;
    let lastY = -100;
    let isHovered = false;

    // Resize canvas with high-DPI crispness
    const handleResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // 4-pointed luxury star drawer (✦)
    const drawStar = (context, cx, cy, spikes, outerRadius, innerRadius, rotation) => {
      let rot = (Math.PI / 2) * 3 + rotation;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      context.beginPath();
      context.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        context.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        context.lineTo(x, y);
        rot += step;
      }
      context.lineTo(cx, cy - outerRadius);
      context.closePath();
      context.fill();
    };

    // Particle Class
    class StarParticle {
      constructor(x, y, vx, vy, isBurst = false) {
        this.x = x + (Math.random() - 0.5) * 8;
        this.y = y + (Math.random() - 0.5) * 8;

        const speedMultiplier = isBurst ? Math.random() * 2.8 + 1.2 : Math.random() * 0.8 + 0.3;
        this.vx = vx * speedMultiplier + (Math.random() - 0.5) * (isBurst ? 3.5 : 1.2);
        this.vy = vy * speedMultiplier + (Math.random() - 0.5) * (isBurst ? 3.5 : 1.2) - (isBurst ? 0.3 : 0.6);

        this.life = 1;
        this.decay = isBurst ? Math.random() * 0.025 + 0.02 : Math.random() * 0.022 + 0.016;

        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.outerRadius = isBurst ? Math.random() * 5 + 3 : Math.random() * 4.5 + 2.5;
        this.innerRadius = this.outerRadius * 0.26;

        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.12;

        this.type = Math.random() > 0.3 ? "star" : "dot";
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.94;
        this.vy *= 0.94;
        this.rotation += this.rotSpeed;
        this.life -= this.decay;
      }

      draw(context) {
        if (this.life <= 0) return;

        context.save();
        const alpha = Math.max(this.life, 0);
        context.globalAlpha = alpha;

        const currentOuter = this.outerRadius * Math.min(this.life * 1.2, 1);
        const currentInner = this.innerRadius * Math.min(this.life * 1.2, 1);

        context.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
        context.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.85)`;
        context.shadowBlur = 6;

        if (this.type === "star") {
          drawStar(context, this.x, this.y, 4, currentOuter, currentInner, this.rotation);
        } else {
          context.beginPath();
          context.arc(this.x, this.y, currentOuter * 0.45, 0, Math.PI * 2);
          context.fill();
        }

        context.restore();
      }
    }

    // Spawn sparkles along cursor trajectory
    const spawnSparkles = (x, y, dx, dy, count = 1) => {
      for (let i = 0; i < count; i++) {
        if (particles.length < maxParticles) {
          particles.push(new StarParticle(x, y, -dx * 0.15, -dy * 0.15));
        }
      }
    };

    // Track mouse move
    const handleMouseMove = (e) => {
      const currentX = e.clientX;
      const currentY = e.clientY;

      if (lastX > 0 && lastY > 0) {
        const dx = currentX - lastX;
        const dy = currentY - lastY;
        const dist = Math.hypot(dx, dy);

        // Spawn based on travel distance (fast movement leaves a rich stardust trail)
        if (dist > 4) {
          const spawnCount = Math.min(Math.floor(dist / 8) + 1, isHovered ? 4 : 2);
          spawnSparkles(currentX, currentY, dx, dy, spawnCount);
        }
      }

      lastX = currentX;
      lastY = currentY;
    };

    // Click burst effect: Explosive stardust flare
    const handleMouseDown = (e) => {
      const burstCount = 12;
      for (let i = 0; i < burstCount; i++) {
        const angle = (Math.PI * 2 * i) / burstCount + (Math.random() - 0.5) * 0.5;
        const speed = Math.random() * 2.5 + 1.5;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        if (particles.length < maxParticles) {
          particles.push(new StarParticle(e.clientX, e.clientY, vx, vy, true));
        }
      }
    };

    // Hover detection over interactive targets
    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target &&
        (target.closest("button") ||
          target.closest("a") ||
          target.closest("input") ||
          target.closest("select") ||
          target.closest('[role="button"]') ||
          target.closest(".cursor-pointer") ||
          window.getComputedStyle(target).cursor === "pointer")
      ) {
        isHovered = true;
      } else {
        isHovered = false;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    // 60fps Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);

        if (p.life <= 0) {
          particles.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[99999] h-full w-full"
      aria-hidden="true"
    />
  );
}

