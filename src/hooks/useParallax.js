import { useState, useEffect, useRef } from 'react';

/**
 * Hook untuk parallax effect berdasarkan scroll position
 * @param {number} speed - Kecepatan parallax (0.1 = lambat, 1 = normal)
 * @param {number} offset - Offset awal scroll sebelum efek aktif
 */
export function useParallax(speed = 0.3, offset = 0) {
  const [transform, setTransform] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (ref.current) {
            // const rect = ref.current.getBoundingClientRect();
            const scrolled = window.scrollY;
            const relativeScroll = scrolled - offset;
            setTransform(relativeScroll * speed);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, offset]);

  return { ref, transform };
}

/**
 * Hook untuk reveal on scroll
 */
export function useRevealOnScroll(threshold = 0.15) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}
