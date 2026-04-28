// ─── Ingredients & Junk ──────────────────────────────────────────────────────

export const INGREDIENTS = [
  { id: 'selada',    label: 'Selada',      emoji: '🥬' },
  { id: 'wortel',    label: 'Wortel',      emoji: '🥕' },
  { id: 'kentang',   label: 'Kentang',     emoji: '🥔' },
  { id: 'jagung',    label: 'Jagung',      emoji: '🌽' },
  { id: 'kol',       label: 'Kol Ungu',    emoji: '🫐' },
  { id: 'telur',     label: 'Telur',       emoji: '🥚' },
  { id: 'ayam',      label: 'Daging Ayam', emoji: '🍗' },
];

export const JUNK_FOODS = [
  { id: 'burger',  label: 'Burger',  emoji: '🍔' },
  { id: 'fries',   label: 'Kentang Goreng', emoji: '🍟' },
  { id: 'soda',    label: 'Soda',    emoji: '🥤' },
  { id: 'pizza',   label: 'Pizza',   emoji: '🍕' },
  { id: 'donut',   label: 'Donut',   emoji: '🍩' },
  { id: 'candy',   label: 'Permen',  emoji: '🍬' },
];

// ─── Generate random mission ──────────────────────────────────────────────────

export function generateMission() {
  // Pilih 3–4 ingredient acak
  const shuffled = [...INGREDIENTS].sort(() => Math.random() - 0.5);
  const count = 3 + Math.floor(Math.random() * 2); // 3 atau 4 jenis
  const selected = shuffled.slice(0, count);

  const mission = {};
  selected.forEach((ing) => {
    mission[ing.id] = 1 + Math.floor(Math.random() * 3); // 1–3 buah
  });
  return mission; // { selada: 2, wortel: 1, ayam: 3 }
}

// ─── Game physics ─────────────────────────────────────────────────────────────

export const GAME_CONFIG = {
  BASKET_WIDTH_RATIO: 0.20,  // lebar keranjang relatif terhadap lebar arena
  BASKET_HEIGHT: 60,
  ITEM_SIZE: 52,
  INITIAL_SPEED: 180,        // px/detik (dipakai di useGameLoop sebagai BASE_SPEED_PPS)
  SPAWN_INTERVAL_MS: 950,    // spawn item baru tiap N ms
  JUNK_PROBABILITY: 0.25,    // 25% kemungkinan junk food
  BASKET_SPEED_RATIO: 0.018, // tidak dipakai langsung, keyboard pakai 60% lebar/detik
};
