import React, { useEffect, useState } from 'react';

function SplashScreen({ onFinish }) {
  const [phase, setPhase] = useState('enter'); // enter → idle → exit

  useEffect(() => {
    // Setelah logo masuk, tunggu sebentar lalu exit
    const idleTimer = setTimeout(() => setPhase('exit'), 2200);
    return () => clearTimeout(idleTimer);
  }, []);

  useEffect(() => {
    if (phase === 'exit') {
      // Tunggu animasi exit selesai baru unmount
      const exitTimer = setTimeout(onFinish, 700);
      return () => clearTimeout(exitTimer);
    }
  }, [phase, onFinish]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fffbe6 0%, #f0fdf4 50%, #fff7ed 100%)',
        opacity: phase === 'exit' ? 0 : 1,
        transform: phase === 'exit' ? 'scale(1.04)' : 'scale(1)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        pointerEvents: phase === 'exit' ? 'none' : 'all',
      }}
    >
      {/* Lingkaran dekoratif background */}
      <div style={{
        position: 'absolute', top: '-80px', left: '-80px',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'rgba(16,185,129,0.08)',
        animation: 'splashOrb 4s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: '-60px', right: '-60px',
        width: '250px', height: '250px', borderRadius: '50%',
        background: 'rgba(251,191,36,0.1)',
        animation: 'splashOrb 4s ease-in-out infinite reverse',
      }} />
      <div style={{
        position: 'absolute', top: '30%', right: '10%',
        width: '120px', height: '120px', borderRadius: '50%',
        background: 'rgba(239,68,68,0.06)',
        animation: 'splashOrb 3s ease-in-out infinite 1s',
      }} />

      {/* Partikel sayuran melayang */}
      {['🥬', '🍅', '🥕', '🌽', '🥒', '🫑'].map((emoji, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            fontSize: '1.5rem',
            opacity: 0.5,
            animation: `splashFloat${i % 3} ${2.5 + i * 0.4}s ease-in-out infinite ${i * 0.3}s`,
            top: `${10 + (i * 13) % 75}%`,
            left: i % 2 === 0 ? `${5 + i * 4}%` : undefined,
            right: i % 2 !== 0 ? `${5 + i * 3}%` : undefined,
          }}
        >
          {emoji}
        </span>
      ))}

      {/* Logo utama */}
      <div
        style={{
          animation: phase === 'enter'
            ? 'splashBounceIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
            : 'splashWiggle 1.2s ease-in-out infinite',
          transformOrigin: 'bottom center',
        }}
      >
        <img
          src="/logo-mori-taste.png"
          alt="Mori Taste"
          style={{
            width: 'min(280px, 60vw)',
            height: 'auto',
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))',
          }}
        />
      </div>

      {/* Tagline */}
      <p
        style={{
          marginTop: '1.5rem',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.85rem',
          fontWeight: 600,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: '#10b981',
          opacity: phase === 'enter' ? 0 : 1,
          transform: phase === 'enter' ? 'translateY(10px)' : 'translateY(0)',
          transition: 'opacity 0.5s ease 0.6s, transform 0.5s ease 0.6s',
        }}
      >
        🌿 Segar. Sehat. Lezat.
      </p>

      {/* Loading dots */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '2.5rem' }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: i === 0 ? '#ef4444' : i === 1 ? '#f59e0b' : '#10b981',
              animation: `splashDot 1s ease-in-out infinite ${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Keyframes via style tag */}
      <style>{`
        @keyframes splashBounceIn {
          0%   { opacity: 0; transform: scale(0.3) translateY(60px); }
          60%  { opacity: 1; transform: scale(1.08) translateY(-10px); }
          80%  { transform: scale(0.96) translateY(4px); }
          100% { transform: scale(1) translateY(0); }
        }
        @keyframes splashWiggle {
          0%, 100% { transform: rotate(0deg) scale(1); }
          20%      { transform: rotate(-3deg) scale(1.02); }
          40%      { transform: rotate(3deg) scale(1.02); }
          60%      { transform: rotate(-2deg) scale(1.01); }
          80%      { transform: rotate(2deg) scale(1.01); }
        }
        @keyframes splashDot {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50%      { transform: translateY(-10px); opacity: 1; }
        }
        @keyframes splashOrb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(20px, -20px) scale(1.1); }
        }
        @keyframes splashFloat0 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-18px) rotate(12deg); }
        }
        @keyframes splashFloat1 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-12px) rotate(-10deg); }
        }
        @keyframes splashFloat2 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-22px) rotate(8deg); }
        }
      `}</style>
    </div>
  );
}

export default SplashScreen;
