import React, { useState } from 'react';
import { useRevealOnScroll } from '../hooks/useParallax';

const accentStyles = {
  emerald: {
    borderHover: 'rgba(16,185,129,0.4)',
    shadowHover: 'rgba(16,185,129,0.2)',
    tagColor: '#10b981',
    btnBg: '#10b981',
    btnHover: '#34d399',
    btnShadow: 'rgba(16,185,129,0.4)',
  },
  gold: {
    borderHover: 'rgba(251,191,36,0.4)',
    shadowHover: 'rgba(251,191,36,0.2)',
    tagColor: '#fbbf24',
    btnBg: '#f59e0b',
    btnHover: '#fbbf24',
    btnShadow: 'rgba(251,191,36,0.4)',
  },
  crimson: {
    borderHover: 'rgba(239,68,68,0.4)',
    shadowHover: 'rgba(239,68,68,0.2)',
    tagColor: '#f87171',
    btnBg: '#ef4444',
    btnHover: '#f87171',
    btnShadow: 'rgba(239,68,68,0.4)',
  },
};

const badgeBg = {
  emerald: '#10b981',
  gold: '#f59e0b',
  crimson: '#ef4444',
};

function ProductCard({ product, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const { ref, isVisible } = useRevealOnScroll(0.1);
  const accent = accentStyles[product.accentColor];

  return (
    <div
      ref={ref}
      className="relative rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer"
      style={{
        background: 'var(--bg-card)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${isHovered ? accent.borderHover : 'var(--border)'}`,
        boxShadow: isHovered ? `0 25px 50px ${accent.shadowHover}` : 'none',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
        transition: `all 0.7s cubic-bezier(0.4,0,0.2,1) ${index * 0.15}s`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge */}
      <div
        className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-xs font-bold text-white"
        style={{ background: badgeBg[product.accentColor] }}
      >
        {product.badge}
      </div>

      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700"
          style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: accent.tagColor }}>
          {product.tagline}
        </p>
        <h3 className="font-display text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          {product.name}
        </h3>
        <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
          {product.description}
        </p>

        {/* Ingredients */}
        <div className="flex flex-wrap gap-2 mb-6">
          {product.ingredients.map((ing) => (
            <span
              key={ing}
              className="px-2 py-1 rounded-full text-xs"
              style={{
                color: 'var(--text-muted)',
                background: 'var(--border)',
                border: '1px solid var(--border)',
              }}
            >
              {ing}
            </span>
          ))}
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>Mulai dari</p>
            <p className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {product.price}
            </p>
          </div>
          <a
            href={`https://wa.me/6289526794973?text=${encodeURIComponent(
              `Halo, Mori Taste! Saya ingin Pesan ${product.name}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg inline-block text-center"
            style={{
              background: accent.btnBg,
              boxShadow: isHovered ? `0 8px 20px ${accent.btnShadow}` : 'none',
            }}
          >
            Pesan
          </a>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
