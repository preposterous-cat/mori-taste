import React from 'react';
import ProductCard from './ProductCard';
import { IMAGES } from '../constants/images';
import { useRevealOnScroll } from '../hooks/useParallax';

const products = [
  {
    id: 1,
    name: 'Salad Full Sayur',
    tagline: 'Pure & Clean',
    description: 'Kombinasi sempurna sayuran segar pilihan — selada, tomat, timun, wortel, dan dressing lemon madu spesial.',
    price: 'Rp 35.000',
    badge: 'Terlaris',
    accentColor: 'emerald',
    image: IMAGES.products.salad,
    ingredients: ['Selada', 'Tomat', 'Timun', 'Wortel', 'Lemon Madu'],
  },
  {
    id: 2,
    name: 'Salad Sayur + Telur',
    tagline: 'Protein Boost',
    description: 'Salad sayur segar dengan tambahan telur rebus yang kaya protein. Pilihan sempurna untuk sarapan bergizi.',
    price: 'Rp 45.000',
    badge: 'Favorit',
    accentColor: 'gold',
    image: IMAGES.products.saladEgg,
    ingredients: ['Selada', 'Tomat', 'Telur Rebus', 'Jagung', 'Olive Oil'],
  },
  {
    id: 3,
    name: 'Salad Sayur + Ayam',
    tagline: 'Power Meal',
    description: 'Salad sayur premium dengan daging ayam panggang yang juicy dan lezat. Kenyang, sehat, dan bergizi tinggi.',
    price: 'Rp 55.000',
    badge: 'Premium',
    accentColor: 'crimson',
    image: IMAGES.products.saladChicken,
    ingredients: ['Selada', 'Ayam Panggang', 'Tomat', 'Keju', 'Caesar'],
  },
];

function Products() {
  const { ref, isVisible } = useRevealOnScroll(0.1);

  return (
    <section id="products" className="relative py-28 overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none" style={{ background: '#10b981' }} />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none" style={{ background: '#f59e0b' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={ref} className="text-center mb-20">
          <p
            className="text-emerald-500 text-sm font-semibold tracking-[0.3em] uppercase mb-4"
            style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease' }}
          >
            Menu Pilihan
          </p>
          <h2
            className="font-display text-5xl md:text-6xl font-bold mb-6"
            style={{
              color: 'var(--text-primary)',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.6s ease 0.1s',
            }}
          >
            Tiga Varian <span className="gradient-text-fresh">Lezat</span>
          </h2>
          <p
            className="text-lg max-w-xl mx-auto"
            style={{
              color: 'var(--text-secondary)',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease 0.2s',
            }}
          >
            Setiap varian dirancang untuk memenuhi kebutuhan nutrisi dan selera Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Products;
