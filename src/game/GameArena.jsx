import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useGameLoop } from './useGameLoop';
import { INGREDIENTS, GAME_CONFIG } from './gameConfig';

const { ITEM_SIZE, BASKET_HEIGHT } = GAME_CONFIG;

function GameArena({ mission, onLose, onSubmit }) {
  const arenaRef = useRef(null);
  const [renderState, setRenderState] = useState({
    items: [], basketX: 0, basketW: 80, basket: {},
  });
  const [caughtFlash, setCaughtFlash] = useState(null);
  const [junkFlash,   setJunkFlash]   = useState(false);

  const handleCatch = useCallback((item) => {
    setCaughtFlash({ emoji: item.emoji, key: item.id + Date.now() });
    setTimeout(() => setCaughtFlash(null), 600);
  }, []);

  const handleJunk = useCallback((item) => {
    setJunkFlash(true);
    setTimeout(() => { setJunkFlash(false); onLose(item); }, 500);
  }, [onLose]);

  const handleStateChange = useCallback((snapshot) => {
    setRenderState(snapshot);
  }, []);

  const {
    startLoop, stopLoop, getBasket,
    handleTouchStart, handleTouchMove, handleTouchEnd,
  } = useGameLoop({
    arenaRef,
    mission,
    onCatch:       handleCatch,
    onJunk:        handleJunk,
    onStateChange: handleStateChange,
  });

  useEffect(() => {
    startLoop();
    return () => stopLoop();
  }, [startLoop, stopLoop]);

  // ── Touch ──────────────────────────────────────────────────────────────────
  const onTouchStart = (e) => handleTouchStart(e.touches[0].clientX);
  const onTouchMove  = (e) => { e.preventDefault(); handleTouchMove(e.touches[0].clientX); };
  const onTouchEnd   = ()  => handleTouchEnd();

  // ── Mouse drag ─────────────────────────────────────────────────────────────
  const mouseDown = useRef(false);
  const onMouseDown = (e) => { mouseDown.current = true;  handleTouchStart(e.clientX); };
  const onMouseMove = (e) => { if (mouseDown.current) handleTouchMove(e.clientX); };
  const onMouseUp   = ()  => { mouseDown.current = false; handleTouchEnd(); };

  const handleSubmit = () => { stopLoop(); onSubmit(getBasket()); };

  const missionEntries = INGREDIENTS.filter((ing) => mission[ing.id]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', userSelect: 'none' }}>

      {/* ── Top bar ── */}
      <div style={{
        padding: '0.5rem 0.75rem',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center',
        flexShrink: 0,
      }}>
        {missionEntries.map((ing) => {
          const have = renderState.basket[ing.id] || 0;
          const need = mission[ing.id];
          const done = have >= need;
          return (
            <div key={ing.id} style={{
              display: 'flex', alignItems: 'center', gap: '3px',
              background: done ? 'rgba(16,185,129,0.15)' : 'var(--bg-card)',
              border: `1px solid ${done ? 'rgba(16,185,129,0.4)' : 'var(--border)'}`,
              borderRadius: '999px', padding: '3px 8px',
              transition: 'all 0.3s',
            }}>
              <span style={{ fontSize: '1rem' }}>{ing.emoji}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: done ? '#10b981' : 'var(--text-primary)' }}>
                {Math.min(have, need)}/{need}
              </span>
              {done && <span style={{ fontSize: '0.7rem' }}>✅</span>}
            </div>
          );
        })}

        <button
          onClick={handleSubmit}
          style={{
            marginLeft: 'auto', padding: '0.35rem 1rem',
            borderRadius: '999px', border: 'none',
            background: 'linear-gradient(135deg, #10b981, #f59e0b)',
            color: '#fff', fontWeight: 700, fontSize: '0.8rem',
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
          touchAction: 'none',
          /* background flash saat kena junk */
          background: junkFlash
            ? 'rgba(239,68,68,0.18)'
            : 'linear-gradient(180deg, var(--bg-base) 0%, var(--bg-surface) 100%)',
          transition: 'background 0.15s',
        }}
      >
        {/* Falling items — pakai transform agar posisi tidak bergantung layout */}
        {renderState.items.map((item) => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: ITEM_SIZE,
              height: ITEM_SIZE,
              /* transform sebagai satu-satunya sumber posisi */
              transform: `translate(${item.x}px, ${item.y}px)`,
              willChange: 'transform',
              fontSize: `${ITEM_SIZE * 0.72}px`,
              lineHeight: `${ITEM_SIZE}px`,
              textAlign: 'center',
              filter: item.isJunk
                ? 'drop-shadow(0 0 6px rgba(239,68,68,0.7))'
                : 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
              pointerEvents: 'none',
            }}
          >
            {item.emoji}
          </div>
        ))}

        {/* Catch pop-up */}
        {caughtFlash && (
          <div
            key={caughtFlash.key}
            style={{
              position: 'absolute',
              bottom: BASKET_HEIGHT + 28,
              left: renderState.basketX + renderState.basketW / 2 - 20,
              fontSize: '2rem',
              animation: 'catchPop 0.6s ease forwards',
              pointerEvents: 'none',
            }}
          >
            {caughtFlash.emoji}
          </div>
        )}

        {/* Basket */}
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            left: 0,
            width: renderState.basketW,
            height: BASKET_HEIGHT,
            transform: `translateX(${renderState.basketX}px)`,
            willChange: 'transform',
            pointerEvents: 'none',
          }}
        >
          {/* Rim */}
          <div style={{
            position: 'absolute', top: 0,
            width: '110%', left: '-5%',
            height: '10px',
            background: '#10b981',
            borderRadius: '999px',
            boxShadow: '0 0 10px rgba(16,185,129,0.5)',
          }} />
          {/* Body */}
          <div style={{
            position: 'absolute', top: '8px',
            width: '100%', height: 'calc(100% - 8px)',
            background: 'linear-gradient(180deg, rgba(16,185,129,0.2) 0%, rgba(16,185,129,0.45) 100%)',
            border: '2px solid #10b981',
            borderTop: 'none',
            borderRadius: '0 0 1rem 1rem',
            boxShadow: '0 0 20px rgba(16,185,129,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.6rem',
          }}>
            🧺
          </div>
        </div>

        <style>{`
          @keyframes catchPop {
            0%   { opacity: 1; transform: translateY(0) scale(1); }
            100% { opacity: 0; transform: translateY(-55px) scale(1.6); }
          }
        `}</style>
      </div>
    </div>
  );
}

export default GameArena;
