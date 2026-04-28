import React, { useEffect, useState } from 'react';
import { INGREDIENTS } from './gameConfig';

function GameResult({ type, mission, basket, junkItem, onRestart, onHome }) {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 50); }, []);

  const isWin = type === 'win';

  // Hitung detail keranjang vs misi
  const missionEntries = INGREDIENTS.filter((ing) => mission[ing.id]);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100%', padding: '2rem',
      textAlign: 'center',
    }}>
      {/* Big emoji */}
      <div style={{
        fontSize: '5rem',
        opacity: show ? 1 : 0,
        transform: show ? 'scale(1)' : 'scale(0.3)',
        transition: 'all 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        marginBottom: '1rem',
      }}>
        {isWin ? '🎉' : '😵'}
      </div>

      <h2 style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: 'clamp(1.6rem, 5vw, 2.4rem)',
        fontWeight: 800,
        color: isWin ? '#10b981' : '#ef4444',
        marginBottom: '0.5rem',
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.5s ease 0.1s',
      }}>
        {isWin ? 'Salad Sempurna!' : 'Game Over!'}
      </h2>

      <p style={{
        color: 'var(--text-secondary)', fontSize: '0.9rem',
        marginBottom: '1.5rem', maxWidth: '300px',
        opacity: show ? 1 : 0, transition: 'all 0.5s ease 0.2s',
      }}>
        {isWin
          ? 'Kamu berhasil mengumpulkan semua bahan salad yang dibutuhkan! 🥗'
          : `Aduh! ${junkItem?.emoji || '🍔'} ${junkItem?.label || 'Junk food'} masuk ke keranjangmu!`}
      </p>

      {/* Result detail */}
      <div style={{
        background: 'var(--bg-card)', backdropFilter: 'blur(16px)',
        border: `1px solid ${isWin ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
        borderRadius: '1.5rem', padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem', width: '100%', maxWidth: '340px',
        opacity: show ? 1 : 0, transition: 'all 0.5s ease 0.3s',
      }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          Hasil Keranjang
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {missionEntries.map((ing) => {
            const have = Math.min(basket[ing.id] || 0, mission[ing.id]);
            const need = mission[ing.id];
            const ok = have >= need;
            return (
              <div key={ing.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.4rem 0.75rem', borderRadius: '0.75rem',
                background: ok ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)',
              }}>
                <span style={{ fontSize: '1.2rem' }}>{ing.emoji}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>{ing.label}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: ok ? '#10b981' : '#ef4444' }}>
                  {have}/{need} {ok ? '✅' : '❌'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Buttons */}
      <div style={{
        display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center',
        opacity: show ? 1 : 0, transition: 'all 0.5s ease 0.4s',
      }}>
        <button
          onClick={onRestart}
          style={{
            padding: '0.8rem 2rem', borderRadius: '999px', border: 'none',
            background: 'linear-gradient(135deg, #10b981, #f59e0b)',
            color: '#fff', fontWeight: 700, fontSize: '0.95rem',
            cursor: 'pointer', boxShadow: '0 6px 20px rgba(16,185,129,0.3)',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Main Lagi 🔄
        </button>
        <button
          onClick={onHome}
          style={{
            padding: '0.8rem 2rem', borderRadius: '999px',
            border: '1px solid var(--border)',
            background: 'var(--bg-card)', backdropFilter: 'blur(10px)',
            color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem',
            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}
        >
          Kembali 🏠
        </button>
      </div>
    </div>
  );
}

export default GameResult;
