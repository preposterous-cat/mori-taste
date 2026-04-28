import { useEffect, useRef, useCallback } from 'react';
import { INGREDIENTS, JUNK_FOODS, GAME_CONFIG } from './gameConfig';

const { ITEM_SIZE, INITIAL_SPEED, SPEED_INCREMENT, SPAWN_INTERVAL_MS, JUNK_PROBABILITY, BASKET_SPEED_RATIO } = GAME_CONFIG;

// Buat item baru yang jatuh
function spawnItem(arenaWidth) {
  const isJunk = Math.random() < JUNK_PROBABILITY;
  const pool = isJunk ? JUNK_FOODS : INGREDIENTS;
  const template = pool[Math.floor(Math.random() * pool.length)];
  return {
    id: Math.random().toString(36).slice(2),
    ...template,
    isJunk,
    x: Math.random() * (arenaWidth - ITEM_SIZE),
    y: -ITEM_SIZE,
  };
}

/**
 * useGameLoop
 * Mengelola state game (items, basket, score) via refs agar tidak re-render tiap frame.
 * Memanggil onStateChange(snapshot) untuk update UI pada event penting.
 */
export function useGameLoop({ arenaRef, mission, onCatch, onJunk, onStateChange }) {
  const stateRef = useRef({
    items: [],
    basketX: 0,
    speed: INITIAL_SPEED,
    keys: { left: false, right: false },
    lastSpawn: 0,
    running: false,
    basket: {},   // { ingredientId: count }
    frameId: null,
  });

  const arenaSize = useRef({ width: 400, height: 600 });

  // Sinkronisasi ukuran arena
  const syncSize = useCallback(() => {
    if (arenaRef.current) {
      const { width, height } = arenaRef.current.getBoundingClientRect();
      arenaSize.current = { width, height };
      // Pastikan basket tidak keluar layar
      const maxX = width - width * GAME_CONFIG.BASKET_WIDTH_RATIO;
      stateRef.current.basketX = Math.min(stateRef.current.basketX, maxX);
    }
  }, [arenaRef]);

  // ── Keyboard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'ArrowLeft')  stateRef.current.keys.left  = true;
      if (e.key === 'ArrowRight') stateRef.current.keys.right = true;
    };
    const onKeyUp = (e) => {
      if (e.key === 'ArrowLeft')  stateRef.current.keys.left  = false;
      if (e.key === 'ArrowRight') stateRef.current.keys.right = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup',   onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup',   onKeyUp);
    };
  }, []);

  // ── Touch / Mouse drag ────────────────────────────────────────────────────
  const touchStartX = useRef(null);
  const touchBasketX = useRef(0);

  const handleTouchStart = useCallback((clientX) => {
    touchStartX.current = clientX;
    touchBasketX.current = stateRef.current.basketX;
  }, []);

  const handleTouchMove = useCallback((clientX) => {
    if (touchStartX.current === null) return;
    const { width } = arenaSize.current;
    const basketW = width * GAME_CONFIG.BASKET_WIDTH_RATIO;
    const dx = clientX - touchStartX.current;
    const newX = Math.max(0, Math.min(width - basketW, touchBasketX.current + dx));
    stateRef.current.basketX = newX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    touchStartX.current = null;
  }, []);

  // ── Main loop ─────────────────────────────────────────────────────────────
  const startLoop = useCallback(() => {
    const s = stateRef.current;
    s.running = true;
    s.items = [];
    s.speed = INITIAL_SPEED;
    s.basket = {};
    s.lastSpawn = performance.now();
    syncSize();
    s.basketX = (arenaSize.current.width - arenaSize.current.width * GAME_CONFIG.BASKET_WIDTH_RATIO) / 2;

    const loop = (now) => {
      if (!s.running) return;

      const { width, height } = arenaSize.current;
      const basketW = width * GAME_CONFIG.BASKET_WIDTH_RATIO;
      const basketSpeed = width * BASKET_SPEED_RATIO;

      // Gerak keyboard
      if (s.keys.left)  s.basketX = Math.max(0, s.basketX - basketSpeed);
      if (s.keys.right) s.basketX = Math.min(width - basketW, s.basketX + basketSpeed);

      // Spawn
      if (now - s.lastSpawn > SPAWN_INTERVAL_MS) {
        s.items.push(spawnItem(width));
        s.lastSpawn = now;
      }

      // Percepat
      s.speed += SPEED_INCREMENT;

      // Gerakkan items
      const basketTop = height - GAME_CONFIG.BASKET_HEIGHT - 10;
      const caught = [];
      const remaining = [];

      for (const item of s.items) {
        item.y += s.speed;

        // Cek tangkap
        const itemCenterX = item.x + ITEM_SIZE / 2;
        const inBasketX = itemCenterX >= s.basketX && itemCenterX <= s.basketX + basketW;
        const inBasketY = item.y + ITEM_SIZE >= basketTop && item.y <= basketTop + GAME_CONFIG.BASKET_HEIGHT;

        if (inBasketX && inBasketY) {
          caught.push(item);
        } else if (item.y < height + ITEM_SIZE) {
          remaining.push(item);
        }
        // item lewat bawah → hilang saja
      }

      s.items = remaining;

      // Proses tangkapan
      for (const item of caught) {
        if (item.isJunk) {
          s.running = false;
          onJunk(item);
          return;
        } else {
          s.basket[item.id] = (s.basket[item.id] || 0) + 1;
          onCatch(item, { ...s.basket });
        }
      }

      // Kirim snapshot posisi untuk render
      onStateChange({
        items: s.items.map((i) => ({ ...i })),
        basketX: s.basketX,
        basketW,
        basket: { ...s.basket },
        speed: s.speed,
      });

      s.frameId = requestAnimationFrame(loop);
    };

    s.frameId = requestAnimationFrame(loop);
  }, [syncSize, onCatch, onJunk, onStateChange]);

  const stopLoop = useCallback(() => {
    stateRef.current.running = false;
    if (stateRef.current.frameId) cancelAnimationFrame(stateRef.current.frameId);
  }, []);

  const getBasket = useCallback(() => ({ ...stateRef.current.basket }), []);

  return { startLoop, stopLoop, getBasket, handleTouchStart, handleTouchMove, handleTouchEnd, syncSize };
}
