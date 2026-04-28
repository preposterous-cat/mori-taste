import React, { useState, useEffect, useRef } from 'react';
import { IMAGES } from '../constants/images';

function Ingredients() {
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef(null);
  const [sectionTop, setSectionTop] = useState(0);

  useEffect(() => {
    if (sectionRef.current) {
      setSectionTop(sectionRef.current.offsetTop);
    }
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const relativeScroll = scrollY - sectionTop;

  return (
    <section ref={sectionRef} className="relative h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Parallax background */}
      <div
        className="absolute inset-0 scale-110"
        style={{
          backgroundImage: `url("${IMAGES.ingredients}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translateY(${relativeScroll * 0.4}px) scale(1.1)`,
          willChange: 'transform',
        }}
      />

      {/* Overlay layers */}
      <div className="absolute inset-0 bg-dark-900/70" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: 'linear-gradient(135deg, rgba(16,185,129,0.5) 0%, rgba(251,191,36,0.3) 50%, rgba(220,38,38,0.4) 100%)',
          transform: `translateY(${relativeScroll * 0.2}px)`,
          willChange: 'transform',
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 text-center px-6"
        style={{
          transform: `translateY(${relativeScroll * -0.1}px)`,
          willChange: 'transform',
        }}
      >
        <p className="text-emerald-400 text-sm font-semibold tracking-[0.3em] uppercase mb-4">
          Komitmen Kami
        </p>
        <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Hanya Bahan{' '}
          <span className="gradient-text-gold">Terbaik</span>
        </h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Dipilih langsung dari petani lokal terpercaya setiap pagi. Tanpa pengawet, tanpa MSG, 100% alami.
        </p>
      </div>
    </section>
  );
}

export default Ingredients;
