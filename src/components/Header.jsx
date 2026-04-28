import React, { useState, useEffect } from 'react';
// import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

function Header() {
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const { isDark } = useTheme();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Beranda', href: '#hero' },
    { label: 'Menu', href: '#products' },
    { label: 'Tentang', href: '#about' },
    { label: 'Kontak', href: '#contact' },
  ];

  const isScrolled = scrollY > 60;

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-500 ${isScrolled ? 'glass-dark py-3 shadow-2xl' : 'bg-transparent py-6'
        }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500 via-yellow-400 to-emerald-500 animate-pulse-glow" />
            <div
              className="absolute inset-0.5 rounded-full flex items-center justify-center"
              style={{ background: 'var(--bg-base)' }}
            >
              <span className="font-display font-bold text-lg gradient-text-gold">M</span>
            </div>
          </div>
          <div>
            <span className="font-display font-bold text-xl tracking-wide" style={{ color: 'var(--text-primary)' }}>
              Mori Taste
            </span>
            <p className="text-xs text-emerald-500 tracking-widest uppercase font-light">Fresh Salad</p>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium transition-smooth tracking-wide relative group hover:text-emerald-500"
              style={{ color: 'var(--text-secondary)' }}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-emerald-500 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}

          {/* Theme Toggle */}
          <ThemeToggle />

          <a
            href="#contact"
            className="px-5 py-2.5 rounded-full text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-white transition-smooth hover:shadow-lg hover:shadow-emerald-500/30"
          >
            Pesan Sekarang
          </a>
        </div>

        {/* Mobile: toggle + hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            style={{ color: 'var(--text-primary)' }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span
                className="h-px transition-all duration-300"
                style={{
                  background: 'var(--text-primary)',
                  transform: isMenuOpen ? 'rotate(45deg) translateY(8px)' : '',
                }}
              />
              <span
                className="h-px transition-all duration-300"
                style={{
                  background: 'var(--text-primary)',
                  opacity: isMenuOpen ? 0 : 1,
                }}
              />
              <span
                className="h-px transition-all duration-300"
                style={{
                  background: 'var(--text-primary)',
                  transform: isMenuOpen ? 'rotate(-45deg) translateY(-8px)' : '',
                }}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className="md:hidden glass-dark transition-all duration-300 overflow-hidden"
        style={{ maxHeight: isMenuOpen ? '16rem' : '0', paddingTop: isMenuOpen ? '1rem' : '0', paddingBottom: isMenuOpen ? '1rem' : '0' }}
      >
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="block px-6 py-3 text-sm hover:text-emerald-500 transition-smooth"
            style={{ color: 'var(--text-secondary)' }}
            onClick={() => setIsMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
      </div>
    </header>
  );
}

export default Header;
