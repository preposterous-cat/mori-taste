import React from 'react';
import { INGREDIENTS } from './gameConfig';

function GameIntro({ mission, onStart }) {
  const missionItems = INGREDIENTS.filter((ing) => mission[ing.id]);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100%', padding: '2rem',
      textAlign: 'center',
    }}>
      {/* Logo kecil */}
      <img src="/logo-mori-taste.png" alt="Mori Taste" style={{ width: '100px', marginBottom: '1rem', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }} />

      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
        Salad Challenge! 🥗
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.8rem', maxWidth: '320px' }}>
        Tangkap bahan-bahan berikut dengan keranjangmu. Hindari junk food atau kamu kalah!
      </p>

      {/* Mission card */}
      <div style={{
        background: 'var(--bg-card)', backdropFilter: 'blur(16px)',
        border: '1px solid var(--border)', borderRadius: '1.5rem',
        padding: '1.5rem 2rem', marginBottom: '2rem',
        width: '100%', maxWidth: '360px',
      }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#10b981', marginBottom: '1rem' }}>
          🎯 Target Bahan
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
          {missionItems.map((ing) => (
            <div key={ing.id} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: '1rem', padding: '0.6rem 1rem', minWidth: '70px',
            }}>
              <span style={{ fontSize: '2rem' }}>{ing.emoji}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 600, marginTop: '0.2rem' }}>{ing.label}</span>
              <span style={{
                marginTop: '0.3rem', background: '#10b981', color: '#fff',
                borderRadius: '999px', padding: '0.1rem 0.6rem', fontSize: '0.75rem', fontWeight: 700,
              }}>×{mission[ing.id]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Junk warning */}
      <div style={{
        background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
        borderRadius: '1rem', padding: '0.75rem 1.25rem',
        marginBottom: '2rem', maxWidth: '360px', width: '100%',
      }}>
        <p style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 600 }}>
          ⚠️ Hindari: 🍔 🍟 🥤 🍕 🍩 🍬
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Junk food masuk keranjang = game over!
        </p>
      </div>

      {/* Controls hint */}
      <div style={{
        display: 'flex', gap: '1rem', marginBottom: '2rem',
        fontSize: '0.78rem', color: 'var(--text-muted)',
      }}>
        <span>⌨️ ← → untuk gerak</span>
        <span>👆 Swipe di layar</span>
      </div>

      <button
        onClick={onStart}
        style={{
          padding: '0.9rem 3rem', borderRadius: '999px', border: 'none',
          background: 'linear-gradient(135deg, #10b981, #f59e0b)',
          color: '#fff', fontWeight: 700, fontSize: '1rem',
          cursor: 'pointer', boxShadow: '0 8px 24px rgba(16,185,129,0.35)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          fontFamily: 'Inter, sans-serif',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        Mulai Game! 🚀
      </button>
    </div>
  );
}

export default GameIntro;
