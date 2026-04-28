import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useGameLoop } from './useGameLoop';
import { INGREDIENTS, GAME_CONFIG } from './gameConfig';

const { ITEM_SIZE, BASKET_HEIGHT } = GAME_CONFIG;

function GameArena({ mission, onLose, onSubmit }) {
  const containerRef = useRef(null); // untuk ResizeObserver & touch
  const canvasRef = useRef(null); // untuk game render

  const [renderState, setRenderState] = useState({
    items: [], basketX: 0, basketW: 80, basket: {}, arenaH: 0,
  });
  const [caughtFlash, setCaughtFlash] = useState(null);
  const [junkFlash, setJunkFlash] = useState(false);

  // ── Canvas draw ────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // reset transform biar tidak numpuk
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // apply DPR scaling
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const { items, basketX, basketW } = renderState;
    const W = canvas.width;
    const H = canvas.height;

    // Clear seluruh canvas setiap frame
    ctx.clearRect(0, 0, W, H);

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, junkFlash ? 'rgba(239,68,68,0.18)' : 'rgba(10,10,10,0)');
    bg.addColorStop(1, junkFlash ? 'rgba(239,68,68,0.08)' : 'rgba(30,30,30,0)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Falling items
    ctx.font = `${ITEM_SIZE * 0.78}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const item of items) {
      ctx.save();
      if (item.isJunk) {
        ctx.shadowColor = 'rgba(239,68,68,0.7)';
        ctx.shadowBlur = 10;
      }
      ctx.fillText(item.emoji, item.x + ITEM_SIZE / 2, item.y + ITEM_SIZE / 2);
      ctx.restore();
    }

    // Basket
    const bTop = H - BASKET_HEIGHT - 10;

    // Rim
    ctx.save();
    ctx.fillStyle = '#10b981';
    ctx.shadowColor = 'rgba(16,185,129,0.5)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.roundRect(basketX - basketW * 0.05, bTop, basketW * 1.1, 10, 5);
    ctx.fill();
    ctx.restore();

    // Body
    ctx.save();
    const bodyGrad = ctx.createLinearGradient(0, bTop + 10, 0, bTop + BASKET_HEIGHT);
    bodyGrad.addColorStop(0, 'rgba(16,185,129,0.2)');
    bodyGrad.addColorStop(1, 'rgba(16,185,129,0.45)');
    ctx.fillStyle = bodyGrad;
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = 'rgba(16,185,129,0.3)';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.roundRect(basketX, bTop + 10, basketW, BASKET_HEIGHT - 10, [0, 0, 14, 14]);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Basket emoji
    ctx.font = '1.6rem serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🧺', basketX + basketW / 2, bTop + BASKET_HEIGHT / 2 + 5);

  }, [renderState, junkFlash]);

  // ── Sync canvas size ke container (DPR-aware) ─────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const { width, height } = container.getBoundingClientRect();
      // Pixel fisik = CSS size × DPR → tajam di retina & mobile
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      // CSS size tetap agar layout tidak berubah
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();
    return () => ro.disconnect();
  }, []);

  // ── Game loop callbacks ────────────────────────────────────────────────────
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
    arenaRef: canvasRef,
    mission,
    onCatch: handleCatch,
    onJunk: handleJunk,
    onStateChange: handleStateChange,
  });

  useEffect(() => {
    startLoop();
    return () => stopLoop();
  }, [startLoop, stopLoop]);

  // ── Touch ──────────────────────────────────────────────────────────────────
  const onTouchStart = (e) => handleTouchStart(e.touches[0].clientX);
  const onTouchMove = (e) => { e.preventDefault(); handleTouchMove(e.touches[0].clientX); };
  const onTouchEnd = () => handleTouchEnd();

  // ── Mouse drag ─────────────────────────────────────────────────────────────
  const mouseDown = useRef(false);
  const onMouseDown = (e) => { mouseDown.current = true; handleTouchStart(e.clientX); };
  const onMouseMove = (e) => { if (mouseDown.current) handleTouchMove(e.clientX); };
  const onMouseUp = () => { mouseDown.current = false; handleTouchEnd(); };

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

      {/* ── Arena: container + canvas ── */}
      <div
        ref={containerRef}
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
          background: 'linear-gradient(180deg, var(--bg-base) 0%, var(--bg-surface) 100%)',
        }}
      >
        {/* Canvas — mengisi penuh container */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        />

        {/* Catch pop-up — tetap DOM agar animasi CSS mudah */}
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
              zIndex: 10,
            }}
          >
            {caughtFlash.emoji}
          </div>
        )}

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
