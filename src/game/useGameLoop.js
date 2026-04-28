import { useEffect, useRef, useCallback } from 'react';
import { INGREDIENTS, JUNK_FOODS, GAME_CONFIG } from './gameConfig';

const {
  ITEM_SIZE,
  SPAWN_INTERVAL_MS,
  JUNK_PROBABILITY,
} = GAME_CONFIG;

// px per detik (bukan per frame) — konsisten di semua device
const BASE_SPEED_PPS = 180;   // kecepatan awal: 180px/detik
const MAX_SPEED_PPS = 520;   // batas atas
const ACCEL_PPS2 = 12;    // percepatan: +12px/detik setiap detik

function spawnItem(arenaWidth) {
  const isJunk = Math.random() < JUNK_PROBABILITY;
  const pool = isJunk ? JUNK_FOODS : INGREDIENTS;
  const tmpl = pool[Math.floor(Math.random() * pool.length)];
  return {
    id: Math.random().toString(36).slice(2),
    ...tmpl,
    isJunk,
    x: Math.random() * (arenaWidth - ITEM_SIZE),
    y: -ITEM_SIZE,
  };
}

export function useGameLoop({ arenaRef, mission, onCatch, onJunk, onStateChange }) {
  const stateRef = useRef({
    items: [],
    basketX: 0,
    speedPPS: BASE_SPEED_PPS,
    keys: { left: false, right: false },
    lastSpawn: 0,
    lastFrame: 0,
    running: false,
    basket: {},
    frameId: null,
  });

  // Ukuran arena — diupdate oleh ResizeObserver
  const arenaSize = useRef({ width: 400, height: 600 });

  // ── ResizeObserver: sync ukuran arena setiap kali layout berubah ──────────
  useEffect(() => {
    if (!arenaRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        arenaSize.current = { width, height };
        // Clamp basket agar tidak keluar
        const basketW = width * GAME_CONFIG.BASKET_WIDTH_RATIO;
        stateRef.current.basketX = Math.min(
          stateRef.current.basketX,
          width - basketW
        );
      }
    });
    ro.observe(arenaRef.current);
    return () => ro.disconnect();
  }, [arenaRef]);

  // ── Keyboard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const dn = (e) => {
      if (e.key === 'ArrowLeft') stateRef.current.keys.left = true;
      if (e.key === 'ArrowRight') stateRef.current.keys.right = true;
    };
    const up = (e) => {
      if (e.key === 'ArrowLeft') stateRef.current.keys.left = false;
      if (e.key === 'ArrowRight') stateRef.current.keys.right = false;
    };
    window.addEventListener('keydown', dn);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', dn); window.removeEventListener('keyup', up); };
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
    stateRef.current.basketX = Math.max(0, Math.min(width - basketW, touchBasketX.current + dx));
  }, []);

  const handleTouchEnd = useCallback(() => { touchStartX.current = null; }, []);

  // ── Main loop ─────────────────────────────────────────────────────────────
  const startLoop = useCallback(() => {
    const s = stateRef.current;
    s.running = true;
    s.items = [];
    s.speedPPS = BASE_SPEED_PPS;
    s.basket = {};

    // Sync ukuran awal
    if (arenaRef.current) {
      const { width, height } = arenaRef.current.getBoundingClientRect();
      arenaSize.current = { width, height };
    }
    const basketW = arenaSize.current.width * GAME_CONFIG.BASKET_WIDTH_RATIO;
    s.basketX = (arenaSize.current.width - basketW) / 2;

    const loop = (now) => {
      if (!s.running) return;

      // Delta time dalam detik — cap 100ms agar tidak loncat saat tab blur
      const dt = Math.min((now - (s.lastFrame || now)) / 1000, 0.1);
      s.lastFrame = now;

      const { width, height } = arenaSize.current;
      const bW = width * GAME_CONFIG.BASKET_WIDTH_RATIO;

      // Gerak keyboard (pakai dt agar konsisten)
      const kbSpeed = width * 0.6 * dt; // 60% lebar per detik
      if (s.keys.left) s.basketX = Math.max(0, s.basketX - kbSpeed);
      if (s.keys.right) s.basketX = Math.min(width - bW, s.basketX + kbSpeed);

      // Spawn
      if (now - s.lastSpawn > SPAWN_INTERVAL_MS) {
        s.items.push(spawnItem(width));
        s.lastSpawn = now;
      }

      // Percepat (delta-time based)
      s.speedPPS = Math.min(MAX_SPEED_PPS, s.speedPPS + ACCEL_PPS2 * dt);

      // Gerakkan items
      const dy = s.speedPPS * dt;
      const basketTop = height - GAME_CONFIG.BASKET_HEIGHT - 10;
      const caught = [];
      const remaining = [];

      for (const item of s.items) {
        item.y += dy;

        const cx = item.x + ITEM_SIZE / 2;
        const inBaskX = cx >= s.basketX && cx <= s.basketX + bW;
        const inBaskY = item.y + ITEM_SIZE >= basketTop && item.y <= basketTop + GAME_CONFIG.BASKET_HEIGHT;

        if (inBaskX && inBaskY) {
          caught.push(item);
        } else if (item.y < height + ITEM_SIZE) {
          remaining.push(item);
        }
      }

      s.items = remaining;

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

      onStateChange({
        items: s.items.map((i) => ({ ...i })),
        basketX: s.basketX,
        basketW: bW,
        basket: { ...s.basket },
      });

      s.frameId = requestAnimationFrame(loop);
    };

    s.lastFrame = performance.now();
    s.lastSpawn = performance.now();
    s.frameId = requestAnimationFrame(loop);
  }, [arenaRef, onCatch, onJunk, onStateChange]);

  const stopLoop = useCallback(() => {
    stateRef.current.running = false;
    if (stateRef.current.frameId) cancelAnimationFrame(stateRef.current.frameId);
  }, []);

  const getBasket = useCallback(() => ({ ...stateRef.current.basket }), []);

  return { startLoop, stopLoop, getBasket, handleTouchStart, handleTouchMove, handleTouchEnd };
}
