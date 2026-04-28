import React from 'react';
import { useRevealOnScroll } from '../hooks/useParallax';

const stats = [
  { value: '500+', label: 'Pelanggan Puas', icon: '😊' },
  { value: '3',    label: 'Varian Menu',    icon: '🥗' },
  { value: '100%', label: 'Bahan Segar',    icon: '🌿' },
  { value: '4.9★', label: 'Rating',         icon: '⭐' },
];

function Stats() {
  const { ref, isVisible } = useRevealOnScroll(0.2);

  return (
    <section ref={ref} className="relative py-16 overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="text-center"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.6s cubic-bezier(0.4,0,0.2,1) ${idx * 0.1}s`,
              }}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="font-display text-4xl font-bold gradient-text-gold mb-1">{stat.value}</div>
              <div className="text-sm tracking-wide" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;
