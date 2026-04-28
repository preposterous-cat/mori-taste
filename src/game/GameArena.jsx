import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useGameLoop } from './useGameLoop';
import { INGREDIENTS, GAME_CONFIG } from './gameConfig';

const { ITEM_SIZE, BASKET_HEIGHT } = GAME_CONFIG;

function GameArena({ mission, onWin, onLose, onSubmit }) {
  const arenaRef = useRef(null);
  const [renderState, setRenderState] = useState({ items: [], basketX: 0, basketW: 80, basket: {} });
  const [caughtFlash, setCaughtFlash] = useState(null); // { emoji, id }
  const [junkFlash, setJunkFlash] = useState(false);

  const handleCatch = useCallback((item) => {
    setCaughtFlash({ emoji: item.emoji, id: item.id + Date.now() });
    setTimeout(() => setCaughtFlash(null), 600);
  }, []);

  const handleJunk = useCallback((item) => {
    setJunkFlash(true);
    setTimeout(() => { setJunkFlash(false); onLose(item); }, 500);
  }, [onLose]);

  const handleStateChange = useCallback((snapshot) => {
    setRenderState(snapshot);
  }, []);

  const { startLoop, stopLoop, getBasket, handleTouchStart, handleTouchMove, handleTouchEnd } = useGameLoop({
    arenaRef,
    mission,
    onCatch: handleCatch,
    onJunk: handleJunk,
    onStateChange: handleStateChange,
  });

  useEffect(() => {
    startLoop();
    return () => stopLoop();
  }, [startLoop, stopLoop]);

  // Touch events
  const onTouchStart = (e) => handleTouchStart(e.touches[0].clientX);
  const onTouchMove  = (e) => { e.preventDefault(); handleTouchMove(e.touches[0].clientX); };
  const onTouchEnd   = () => handleTouchEnd();

  // Mouse drag
  const mouseDown = useRef(false);
  const onMouseDown = (e) => { mouseDown.current = true; handleTouchStart(e.clientX); };
  const onMouseMove = (e) => { if (mouseDown.current) handleTouchMove(e.clientX); };
  const onMouseUp   = () => { mouseDown.current = false; handleTouchEnd(); };

  const handleSubmit = () => {
    stopLoop();
    onSubmit(getBasket());
  };

  // Basket progress bar per ingredient
  const missionEntries = INGREDIENTS.filter((ing) => mission[ing.id]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', userSelect: 'none' }}>

      {/* ── Top bar: mission progress ── */}
      <div style={{
        padding: '0.6rem 1rem',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center',
      }}>
        {missionEntries.map((ing) => {
          const have = renderState.basket[ing.id] || 0;
          const need = mission[ing.id];
          const done = have >= need;
          return (
            <div key={ing.id} style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              background: done ? 'rgba(16,185,129,0.15)' : 'var(--bg-card)',
              border: `1px solid ${done ? 'rgba(16,185,129,0.4)' : 'var(--border)'}`,
              borderRadius: '999px', padding: '3px 10px',
              transition: 'all 0.3s',
            }}>
              <span style={{ fontSize: '1.1rem' }}>{ing.emoji}</span>
              <span style={{
                fontSize: '0.78rem', fontWeight: 700,
                color: done ? '#10b981' : 'var(--text-primary)',
              }}>
                {Math.min(have, need)}/{need}
              </span>
              {done && <span style={{ fontSize: '0.8rem' }}>✅</span>}
            </div>
          );
        })}

        {/* Tombol kirim */}
        <button
          onClick={handleSubmit}
          style={{
            marginLeft: 'auto', padding: '0.4rem 1.1rem',
            borderRadius: '999px', border: 'none',
            background: 'linear-gradient(135deg, #10b981, #f59e0b)',
            color: '#fff', fontWeight: 700, fontSize: '0.82rem',
            cursor: 'pointer', whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Kirim 🧺
        </button>
      </div>

      {/* ── Arena ── */}
      <div
        ref={arenaRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          cursor: 'grab',
          background: junkFlash
            ? 'rgba(239,68,68,0.15)'
            : 'linear-gradient(180deg, var(--bg-base) 0%, var(--bg-surface) 100%)',
          transition: 'background 0.2s',
          touchAction: 'none',
        }}
      >
        {/* Falling items */}
        {renderState.items.map((item) => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              left: item.x,
              top: item.y,
              width: ITEM_SIZE,
              height: ITEM_SIZE,
              fontSize: `${ITEM_SIZE * 0.72}px`,
              lineHeight: `${ITEM_SIZE}px`,
              textAlign: 'center',
              filter: item.isJunk ? 'drop-shadow(0 0 6px rgba(239,68,68,0.6))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
              pointerEvents: 'none',
              willChange: 'transform',
            }}
          >
            {item.emoji}
          </div>
        ))}

        {/* Catch flash */}
        {caughtFlash && (
          <div style={{
            position: 'absolute',
            bottom: BASKET_HEIGHT + 30,
            left: renderState.basketX + renderState.basketW / 2 - 20,
            fontSize: '2rem',
            animation: 'catchPop 0.6s ease forwards',
            pointerEvents: 'none',
          }}>
            {caughtFlash.emoji}
          </div>
        )}

        {/* Basket */}
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            left: renderState.basketX,
            width: renderState.basketW,
            height: BASKET_HEIGHT,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            willChange: 'transform',
          }}
        >
          {/* Basket body */}
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(180deg, rgba(16,185,129,0.25) 0%, rgba(16,185,129,0.5) 100%)',
            border: '2.5px solid #10b981',
            borderRadius: '0 0 1.2rem 1.2rem',
            borderTop: 'none',
            boxShadow: '0 0 20px rgba(16,185,129,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
          }}>
            🧺
          </div>
          {/* Basket rim */}
          <div style={{
            position: 'absolute',
            top: 0,
            width: '110%',
            height: '10px',
            background: '#10b981',
            borderRadius: '999px',
            boxShadow: '0 0 10px rgba(16,185,129,0.5)',
          }} />
        </div>

        {/* Keyframe styles */}
        <style>{`
          @keyframes catchPop {
            0%   { opacity: 1; transform: translateY(0) scale(1); }
            100% { opacity: 0; transform: translateY(-50px) scale(1.5); }
          }
        `}</style>
      </div>
    </div>
  );
}

export default GameArena;
