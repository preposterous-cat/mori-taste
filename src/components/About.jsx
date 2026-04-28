import React, { useState, useEffect, useRef } from 'react';
import { IMAGES } from '../constants/images';
import { useRevealOnScroll } from '../hooks/useParallax';

const features = [
  { icon: '🌱', title: 'Bahan Segar Alami',  desc: 'Dipilih langsung dari petani lokal setiap pagi' },
  { icon: '🚫', title: 'Tanpa Pengawet',      desc: 'Bebas MSG, pengawet, dan bahan kimia berbahaya' },
  { icon: '💪', title: 'Kaya Nutrisi',        desc: 'Tinggi vitamin, mineral, dan serat untuk tubuh sehat' },
  { icon: '🚀', title: 'Pengiriman Cepat',    desc: 'Tiba dalam kondisi segar langsung ke tangan Anda' },
];

function About() {
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef(null);
  const [sectionTop, setSectionTop] = useState(0);
  const { ref: contentRef, isVisible } = useRevealOnScroll(0.15);

  useEffect(() => {
    if (sectionRef.current) setSectionTop(sectionRef.current.offsetTop);
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

  const rel = scrollY - sectionTop;

  return (
    <section id="about" ref={sectionRef} className="relative py-28 overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left - Image parallax */}
          <div className="relative h-[500px]">
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              <img
                src={IMAGES.about}
                alt="Mori Taste"
                className="w-full h-full object-cover"
                style={{ transform: `translateY(${rel * 0.15}px)`, willChange: 'transform' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Floating card bottom-right */}
            <div
              className="absolute -bottom-6 -right-6 rounded-2xl p-5 shadow-2xl"
              style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border)',
                transform: `translateY(${rel * -0.1}px)`,
                willChange: 'transform',
              }}
            >
              <p className="text-emerald-500 text-xs font-semibold tracking-widest uppercase mb-1">Kepuasan</p>
              <p className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>98%</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Pelanggan puas</p>
            </div>

            {/* Floating badge top-left */}
            <div
              className="absolute -top-4 -left-4 rounded-2xl p-4 shadow-2xl"
              style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border)',
                transform: `translateY(${rel * 0.08}px)`,
                willChange: 'transform',
              }}
            >
              <p className="text-2xl mb-1">🌿</p>
              <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>100% Organik</p>
            </div>
          </div>

          {/* Right - Content */}
          <div ref={contentRef}>
            <p
              className="text-emerald-500 text-sm font-semibold tracking-[0.3em] uppercase mb-4"
              style={{ opacity: isVisible ? 1 : 0, transition: 'all 0.6s ease' }}
            >
              Tentang Kami
            </p>
            <h2
              className="font-display text-5xl font-bold mb-6 leading-tight"
              style={{
                color: 'var(--text-primary)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.6s ease 0.1s',
              }}
            >
              Dibuat dengan <span className="gradient-text-gold">Cinta</span>
            </h2>
            <p
              className="text-lg leading-relaxed mb-8"
              style={{
                color: 'var(--text-secondary)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.6s ease 0.2s',
              }}
            >
              Mori Taste lahir dari kecintaan terhadap gaya hidup sehat. Kami percaya bahwa makanan sehat tidak harus membosankan — setiap salad kami adalah karya seni kuliner yang memanjakan lidah sekaligus menyehatkan tubuh.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-2xl transition-smooth"
                  style={{
                    background: 'var(--bg-card)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--border)',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: `all 0.6s ease ${0.3 + idx * 0.1}s`,
                  }}
                >
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{feature.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
