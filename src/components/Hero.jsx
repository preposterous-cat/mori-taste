import React, { useState, useEffect, useRef } from 'react';
import { IMAGES } from '../constants/images';

function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => { setScrollY(window.scrollY); ticking = false; });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="hero" ref={sectionRef} className="relative h-screen flex items-center justify-center overflow-hidden">

      {/* Layer 1 - BG image (slowest) */}
      <div
        className="absolute inset-0 scale-110"
        style={{
          backgroundImage: `url("${IMAGES.hero}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translateY(${scrollY * 0.6}px) scale(1.1)`,
          willChange: 'transform',
        }}
      />

      {/* Layer 2 - Dark overlay (always dark for readability) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/90" />

      {/* Layer 3 - Color tint */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 30% 50%, rgba(16,185,129,0.4) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(220,38,38,0.3) 0%, transparent 60%)',
          transform: `translateY(${scrollY * 0.3}px)`,
          willChange: 'transform',
        }}
      />

      {/* Layer 4 - Floating orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #10b981, transparent)',
          transform: `translateY(${scrollY * -0.2}px)`,
          willChange: 'transform',
        }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #fbbf24, transparent)',
          transform: `translateY(${scrollY * -0.35}px)`,
          willChange: 'transform',
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 text-center px-6 max-w-4xl"
        style={{
          transform: `translateY(${scrollY * 0.15}px)`,
          willChange: 'transform',
        }}
      >
        <p className="text-emerald-400 text-sm font-semibold tracking-[0.3em] uppercase mb-6">
          🌿 Segar. Sehat. Lezat.
        </p>
        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-black mb-6 leading-none">
          <span className="text-white">Mori</span>
          <br />
          <span className="gradient-text-gold">Taste</span>
        </h1>
        <p className="text-white text-lg md:text-xl font-light max-w-xl mx-auto mb-10 leading-relaxed">
          Salad sayur premium dengan bahan-bahan segar pilihan. Nikmati setiap gigitan yang penuh nutrisi dan cita rasa.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#products"
            className="px-8 py-4 rounded-full font-semibold bg-emerald-500 hover:bg-emerald-400 text-white transition-smooth hover:shadow-2xl hover:shadow-emerald-500/40 hover:scale-105"
          >
            Lihat Menu
          </a>
          <a
            href="#about"
            className="px-8 py-4 rounded-full font-semibold text-white border border-white/30 hover:border-emerald-400/60 hover:bg-white/10 transition-smooth hover:scale-105"
          >
            Tentang Kami
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
        <span className="text-xs text-gray-400 tracking-widest uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-emerald-400 to-transparent animate-pulse" />
      </div>
    </section>
  );
}

export default Hero;
