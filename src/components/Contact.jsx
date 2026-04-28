import React, { useState } from 'react';
import { useRevealOnScroll } from '../hooks/useParallax';

const contactInfo = [
  { icon: '📍', label: 'Alamat', value: 'Palembang, Indonesia' },
  { icon: '📞', label: 'Telepon', value: '+62 895-2679-4973 / +62 851-7323-6321' },
  { icon: '✉️', label: 'Email', value: 'polypteruschan@gmail.com' },
  { icon: '🕐', label: 'Hari PO', value: 'Senin & Kamis' },
];

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const { ref, isVisible } = useRevealOnScroll(0.1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="relative py-28 overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={ref} className="text-center mb-16">
          <p
            className="text-emerald-500 text-sm font-semibold tracking-[0.3em] uppercase mb-4"
            style={{ opacity: isVisible ? 1 : 0, transition: 'all 0.6s ease' }}
          >
            Hubungi Kami
          </p>
          <h2
            className="font-display text-5xl font-bold"
            style={{
              color: 'var(--text-primary)',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.6s ease 0.1s',
            }}
          >
            Mari <span className="gradient-text-gold">Terhubung</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info */}
          <div>
            <p className="text-lg leading-relaxed mb-10" style={{ color: 'var(--text-secondary)' }}>
              Ada pertanyaan tentang menu atau ingin melakukan pemesanan dalam jumlah besar? Kami siap membantu Anda.
            </p>
            <div className="space-y-4">
              {contactInfo.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 rounded-2xl transition-smooth"
                  style={{
                    background: 'var(--bg-card)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--border)',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
                    transition: `all 0.6s ease ${idx * 0.1}s`,
                  }}
                >
                  <span className="text-2xl w-10 text-center">{item.icon}</span>
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-muted)' }}>{item.label}</p>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl p-8"
            style={{
              background: 'var(--bg-card)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--border)',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(30px)',
              transition: 'all 0.7s ease 0.2s',
            }}
          >
            <div className="space-y-5">
              {[
                { name: 'name', label: 'Nama', type: 'text', placeholder: 'Nama lengkap Anda' },
                { name: 'email', label: 'Email', type: 'email', placeholder: 'email@anda.com' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="text-xs uppercase tracking-widest mb-2 block" style={{ color: 'var(--text-muted)' }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    required
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/40 transition-smooth"
                    style={{
                      background: 'var(--border)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
              ))}
              <div>
                <label className="text-xs uppercase tracking-widest mb-2 block" style={{ color: 'var(--text-muted)' }}>
                  Pesan
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tulis pesan Anda..."
                  rows="5"
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/40 transition-smooth resize-none"
                  style={{
                    background: 'var(--border)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/30"
                style={{ background: 'linear-gradient(135deg, #10b981, #f59e0b, #10b981)', backgroundSize: '200%' }}
              >
                {submitted ? '✓ Pesan Terkirim!' : 'Kirim Pesan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
