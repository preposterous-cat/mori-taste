import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Products from './components/Products';
import Ingredients from './components/Ingredients';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <ThemeProvider>
      <div className="overflow-x-hidden" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
        <Header />
        <Hero />
        <Stats />
        <Products />
        <Ingredients />
        <About />
        <Testimonials />
        <Contact />
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
