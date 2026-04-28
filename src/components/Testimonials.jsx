import React from 'react';
import { useRevealOnScroll } from '../hooks/useParallax';

const testimonials = [
  {
    name: 'Rina Kusuma',
    role: 'Fitness Enthusiast',
    avatar: 'RK',
    text: 'Salad Mori Taste jadi andalan diet sehat saya! Rasanya enak banget, segar, dan bikin kenyang. Sudah langganan 3 bulan!',
    rating: 5,
    gradFrom: '#10b981',
    gradTo: '#059669',
  },
  {
    name: 'Budi Santoso',
    role: 'Office Worker',
    avatar: 'BS',
    text: 'Cocok banget buat makan siang di kantor. Praktis, sehat, dan harganya terjangkau. Salad ayamnya favorit saya!',
    rating: 5,
    gradFrom: '#f59e0b',
    gradTo: '#d97706',
  },
  {
    name: 'Dewi Rahayu',
    role: 'Ibu Rumah Tangga',
    avatar: 'DR',
    text: 'Anak-anak saya yang biasanya susah makan sayur, sekarang malah minta salad Mori Taste terus. Luar biasa!',
    rating: 5,
    gradFrom: '#ef4444',
    gradTo: '#dc2626',
  },
];

function Testimonials() {
  const { ref, isVisible } = useRevealOnScroll(0.1);

  return (
    <section className="relative py-28 overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: '#10b981' }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={ref} className="text-center mb-16">
          <p
            className="text-emerald-500 text-sm font-semibold tracking-[0.3em] uppercase mb-4"
            style={{ opacity: isVisible ? 1 : 0, transition: 'all 0.6s ease' }}
          >
            Testimoni
          </p>
          <h2
            className="font-display text-5xl font-bold"
            style={{
              color: 'var(--text-primary)',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.6s ease 0.1s',
            }}
          >
            Kata Mereka
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="rounded-3xl p-8 transition-smooth hover:shadow-2xl"
              style={{
                background: 'var(--bg-card)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transition: `all 0.7s ease ${idx * 0.15}s`,
              }}
            >
              <div className="flex gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-8 italic" style={{ color: 'var(--text-secondary)' }}>
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: `linear-gradient(135deg, ${t.gradFrom}, ${t.gradTo})` }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
