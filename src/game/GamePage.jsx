import React, { useState, useCallback } from 'react';
import { generateMission, INGREDIENTS } from './gameConfig';
import GameIntro from './GameIntro';
import GameArena from './GameArena';
import GameResult from './GameResult';

// phase: 'intro' | 'playing' | 'win' | 'lose'

function GamePage({ onHome }) {
  const [phase, setPhase] = useState('intro');
  const [mission, setMission] = useState(() => generateMission());
  const [resultData, setResultData] = useState({ basket: {}, junkItem: null });

  const handleStart = useCallback(() => setPhase('playing'), []);

  const handleSubmit = useCallback((basket) => {
    // Cek apakah semua misi terpenuhi
    const allMet = INGREDIENTS
      .filter((ing) => mission[ing.id])
      .every((ing) => (basket[ing.id] || 0) >= mission[ing.id]);

    setResultData({ basket, junkItem: null });
    setPhase(allMet ? 'win' : 'lose');
  }, [mission]);

  const handleLose = useCallback((junkItem) => {
    setResultData((prev) => ({ ...prev, junkItem }));
    setPhase('lose');
  }, []);

  const handleRestart = useCallback(() => {
    setMission(generateMission());
    setResultData({ basket: {}, junkItem: null });
    setPhase('intro');
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', flexDirection: 'column',
      background: 'var(--bg-base)',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* ── Header bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.75rem 1.25rem',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <img src="/logo-mori-taste.png" alt="Mori Taste" style={{ height: '36px', width: 'auto' }} />
          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>Salad Challenge</p>
            <p style={{ fontSize: '0.65rem', color: '#10b981', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Memory Game</p>
          </div>
        </div>
        <button
          onClick={onHome}
          style={{
            padding: '0.4rem 1rem', borderRadius: '999px',
            border: '1px solid var(--border)',
            background: 'var(--bg-card)', backdropFilter: 'blur(10px)',
            color: 'var(--text-secondary)', fontSize: '0.8rem',
            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}
        >
          ← Kembali
        </button>
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {phase === 'intro' && (
          <div style={{ height: '100%', overflowY: 'auto' }}>
            <GameIntro mission={mission} onStart={handleStart} />
          </div>
        )}

        {phase === 'playing' && (
          <GameArena
            mission={mission}
            onWin={() => {}}
            onLose={handleLose}
            onSubmit={handleSubmit}
          />
        )}

        {(phase === 'win' || phase === 'lose') && (
          <div style={{ height: '100%', overflowY: 'auto' }}>
            <GameResult
              type={phase}
              mission={mission}
              basket={resultData.basket}
              junkItem={resultData.junkItem}
              onRestart={handleRestart}
              onHome={onHome}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default GamePage;
