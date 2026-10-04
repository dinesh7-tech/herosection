'use client';

import React, { useEffect, useRef } from 'react';

const DESKTOP_RADIUS = 235;
const MOBILE_RADIUS = 150;
const TOPMATE_URL = 'https://topmate.io/suryansh777777/1820500';

export default function GlassHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rawPosRef = useRef({ x: -999, y: -999 });
  const smoothedPosRef = useRef({ x: -999, y: -999 });
  const currentRadiusRef = useRef(0);
  const targetRadiusRef = useRef(0);
  const touchStateRef = useRef(false);
  const frameIdRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isReducedMotion = mediaQuery.matches;

    const handleMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
    };
    mediaQuery.addEventListener('change', handleMotionChange);

    // Single requestAnimationFrame loop
    const renderLoop = () => {
      const lerpPos = isReducedMotion ? 1 : 0.14;
      const lerpRad = isReducedMotion ? 1 : 0.12;

      // Smooth position interpolation
      if (smoothedPosRef.current.x === -999 && rawPosRef.current.x !== -999) {
        smoothedPosRef.current.x = rawPosRef.current.x;
        smoothedPosRef.current.y = rawPosRef.current.y;
      } else if (rawPosRef.current.x !== -999) {
        smoothedPosRef.current.x +=
          (rawPosRef.current.x - smoothedPosRef.current.x) * lerpPos;
        smoothedPosRef.current.y +=
          (rawPosRef.current.y - smoothedPosRef.current.y) * lerpPos;
      }

      // Smooth radius interpolation
      currentRadiusRef.current +=
        (targetRadiusRef.current - currentRadiusRef.current) * lerpRad;

      // Small threshold to snap to 0 when near 0
      if (
        targetRadiusRef.current === 0 &&
        currentRadiusRef.current < 0.2
      ) {
        currentRadiusRef.current = 0;
      }

      // Update CSS variables directly on container
      container.style.setProperty(
        '--reveal-x',
        `${smoothedPosRef.current.x.toFixed(2)}px`
      );
      container.style.setProperty(
        '--reveal-y',
        `${smoothedPosRef.current.y.toFixed(2)}px`
      );
      container.style.setProperty(
        '--reveal-radius',
        `${currentRadiusRef.current.toFixed(2)}px`
      );

      frameIdRef.current = requestAnimationFrame(renderLoop);
    };

    frameIdRef.current = requestAnimationFrame(renderLoop);

    // Event listeners
    const handlePointerEnter = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        rawPosRef.current = { x, y };
        if (smoothedPosRef.current.x === -999) {
          smoothedPosRef.current = { x, y };
        }
        targetRadiusRef.current = DESKTOP_RADIUS;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      rawPosRef.current = { x, y };

      if (smoothedPosRef.current.x === -999) {
        smoothedPosRef.current = { x, y };
      }

      if (e.pointerType === 'touch') {
        touchStateRef.current = true;
        targetRadiusRef.current = MOBILE_RADIUS;
      } else {
        if (targetRadiusRef.current === 0) {
          targetRadiusRef.current = DESKTOP_RADIUS;
        }
      }
    };

    const handlePointerLeave = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
        targetRadiusRef.current = 0;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      rawPosRef.current = { x, y };
      if (smoothedPosRef.current.x === -999) {
        smoothedPosRef.current = { x, y };
      }

      if (e.pointerType === 'touch') {
        touchStateRef.current = true;
        targetRadiusRef.current = MOBILE_RADIUS;
      } else {
        targetRadiusRef.current = DESKTOP_RADIUS;
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        touchStateRef.current = false;
        targetRadiusRef.current = 0;
      }
    };

    const handlePointerCancel = () => {
      touchStateRef.current = false;
      targetRadiusRef.current = 0;
    };

    container.addEventListener('pointerenter', handlePointerEnter);
    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);
    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerCancel);

    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      mediaQuery.removeEventListener('change', handleMotionChange);
      container.removeEventListener('pointerenter', handlePointerEnter);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerCancel);
    };
  }, []);

  return (
    <main
      ref={containerRef}
      className="relative w-screen h-[100dvh] h-screen overflow-hidden select-none bg-[#0e1722]"
    >
      {/* LAYER 1: Base portrait */}
      <div
        aria-hidden="true"
        className="anim-portrait absolute inset-0 z-[1] bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: "url('/images/Base_image_desktop.png')",
        }}
      />

      {/* LAYER 2: Reveal portrait (masked) */}
      <div
        aria-hidden="true"
        className="reveal-mask-layer absolute inset-0 z-[2] bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: "url('/images/Reveal_image_desktop.png')",
        }}
      />

      {/* LAYER 3: Technical grid and large circle */}
      <div
        aria-hidden="true"
        className="anim-grid absolute inset-0 z-[3] pointer-events-none"
      >
        {/* Fine crosshairs & framing lines */}
        <div className="absolute inset-0 opacity-40">
          {/* Top horizontal rule with coordinate ticks */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-slate-400/20" />
          <div className="absolute top-[2.5rem] left-[max(5.6vw,2rem)] right-[max(5.6vw,2rem)] h-[1px] bg-slate-400/15" />

          {/* Left vertical guide */}
          <div className="absolute top-0 bottom-0 left-[max(5.6vw,2rem)] w-[1px] bg-slate-400/15" />
          {/* Right vertical guide */}
          <div className="absolute top-0 bottom-0 right-[max(5.6vw,2rem)] w-[1px] bg-slate-400/15" />

          {/* Subtle large editorial circle in center-right */}
          <div className="absolute top-1/2 right-[10vw] -translate-y-1/2 w-[min(70vh,550px)] h-[min(70vh,550px)] rounded-full border border-slate-400/20 pointer-events-none hidden md:block" />
          <div className="absolute top-1/2 right-[10vw] -translate-y-1/2 w-[min(74vh,580px)] h-[min(74vh,580px)] rounded-full border border-dashed border-slate-400/10 pointer-events-none hidden md:block" />

          {/* Corner crosshairs */}
          <div className="absolute top-[max(2.5rem,24px)] left-[max(5.6vw,2rem)] -translate-x-1/2 -translate-y-1/2 text-slate-400/40 text-[10px] font-mono select-none">
            +
          </div>
          <div className="absolute top-[max(2.5rem,24px)] right-[max(5.6vw,2rem)] translate-x-1/2 -translate-y-1/2 text-slate-400/40 text-[10px] font-mono select-none">
            +
          </div>
          <div className="absolute bottom-[max(2.5rem,24px)] left-[max(5.6vw,2rem)] -translate-x-1/2 translate-y-1/2 text-slate-400/40 text-[10px] font-mono select-none">
            +
          </div>
          <div className="absolute bottom-[max(2.5rem,24px)] right-[max(5.6vw,2rem)] translate-x-1/2 translate-y-1/2 text-slate-400/40 text-[10px] font-mono select-none">
            +
          </div>

          {/* Micro coordinate metadata */}
          <div className="absolute top-[35%] right-[max(5.6vw,2rem)] text-right font-mono text-[9px] tracking-widest text-slate-400/50 hidden lg:block uppercase">
            <div>SYS // 04.29</div>
            <div className="mt-1 text-slate-400/40">28.6139° N, 77.2090° E</div>
          </div>
        </div>
      </div>

      {/* LAYER 4: Headline, copy and manifesto */}
      <section className="relative z-[4] w-full h-full pointer-events-none">
        {/* Main Headline */}
        <div className="absolute top-[30%] sm:top-[34%] left-[max(5.6vw,2rem)] max-w-xl">
          <h1 className="hero-heading font-sans font-light tracking-[-0.085em] text-slate-900 drop-shadow-sm flex flex-col">
            <span className="anim-line-1 block">Building</span>
            <span className="anim-line-2 block">Beyond</span>
            <span className="anim-line-3 block">Possible.</span>
          </h1>
        </div>

        {/* Bottom Left Copy & CTA */}
        <div className="anim-copy absolute bottom-[max(2.5rem,4vh)] left-[max(5.6vw,2rem)] max-w-[22rem] sm:max-w-[26rem] pointer-events-auto">
          <p className="text-[14px] sm:text-[15px] font-normal leading-relaxed text-slate-700/90 tracking-[-0.015em]">
            I build useful products, experiment with emerging technology, and
            turn the process into stories worth sharing.
          </p>
          <div className="mt-5">
            <a
              href={TOPMATE_URL}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-6 py-2.5 rounded-full bg-white/95 hover:bg-white text-slate-900 font-medium text-[13px] sm:text-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-white/60 hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-200 active:scale-[0.98]"
            >
              Explore my work
            </a>
          </div>
        </div>

        {/* Right Manifesto */}
        <div className="anim-manifesto absolute bottom-[max(2.5rem,4vh)] right-[max(5.6vw,2rem)] pointer-events-none hidden sm:block">
          <div className="font-mono text-[11px] sm:text-[12px] leading-[1.35] tracking-[0.14em] uppercase text-slate-600/90 text-right">
            <div>BUILDING THE</div>
            <div>NEXT VERSION</div>
            <div>IN PUBLIC</div>
          </div>
        </div>
      </section>

      {/* LAYER 5: Navigation */}
      <header className="anim-nav absolute top-[max(2.5rem,env(safe-area-inset-top,0px))] left-0 right-0 z-[5] px-[max(5.6vw,2rem)] flex items-center justify-between pointer-events-auto">
        {/* Brand Logo & Name */}
        <a
          href="#"
          className="focus-ring flex items-center gap-3 py-2 -ml-2 pl-2 rounded-lg group"
          aria-label="Suryansh Portfolio Home"
        >
          {/* Angular S mark (original inline SVG) */}
          <svg
            width="28"
            height="28"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform duration-300 group-hover:scale-105"
            aria-hidden="true"
          >
            <path
              d="M24 6L8 6L6 14L20 14L26 26L10 26"
              stroke="#0f172a"
              strokeWidth="2.75"
              strokeLinecap="round"
              strokeLinejoin="bevel"
            />
            <circle cx="24" cy="6" r="2" fill="#0f172a" />
            <circle cx="10" cy="26" r="2" fill="#0f172a" />
          </svg>
          <span className="font-sans font-semibold text-[17px] tracking-tight text-slate-900">
            Suryansh
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-8 text-[14px] font-medium tracking-tight text-slate-700"
        >
          {['About', 'Work', 'Process', 'Experiments'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="focus-ring min-h-[44px] min-w-[44px] flex items-center justify-center px-2 py-1 rounded-md text-slate-700/80 hover:text-slate-950 transition-colors duration-150"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Let's talk CTA */}
        <div>
          <a
            href={TOPMATE_URL}
            target="_blank"
            rel="noreferrer"
            className="focus-ring inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-5 sm:px-6 py-2 rounded-full bg-white/95 hover:bg-white text-slate-900 font-medium text-[13px] sm:text-[14px] shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-white/60 hover:shadow-[0_4px_18px_rgba(0,0,0,0.09)] transition-all duration-200 active:scale-[0.98]"
          >
            Let&apos;s talk
          </a>
        </div>
      </header>
    </main>
  );
}
