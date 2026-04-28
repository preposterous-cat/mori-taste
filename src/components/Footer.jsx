import React from 'react';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative py-16 overflow-hidden"
      style={{ background: 'var(--bg-base)', borderTop: '1px solid var(--border)' }}
    >
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <img
                src="/logo-mori-taste.png"
                alt="Mori Taste"
                className={`h-24 w-auto object-contain`}
              />
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-muted)' }}>
              Salad sayur premium dengan bahan-bahan segar pilihan. Sehat, lezat, dan terjangkau untuk semua kalangan.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-5 text-sm tracking-widest uppercase" style={{ color: 'var(--text-primary)' }}>
              Menu
            </h4>
            <ul className="space-y-3">
              {['Beranda', 'Produk', 'Tentang', 'Kontak'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-sm hover:text-emerald-500 transition-smooth"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-5 text-sm tracking-widest uppercase" style={{ color: 'var(--text-primary)' }}>
              Ikuti Kami
            </h4>
            <div className="flex gap-3">
              {[
                { label: 'IG', hoverBg: '#ef4444' },
                { label: 'FB', hoverBg: '#2563eb' },
                { label: 'TW', hoverBg: '#0ea5e9' },
              ].map((social) => (
                <a
                  key={social.label}
                  href="https://example.com"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-smooth hover:text-white"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-muted)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = social.hoverBg; e.currentTarget.style.borderColor = social.hoverBg; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            © {year} Mori Taste. Semua hak dilindungi.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)', opacity: 0.5 }}>
            Made with 🌿 for a healthier life
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
