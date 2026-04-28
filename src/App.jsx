import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Products from './components/Products';
import Ingredients from './components/Ingredients';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import GamePage from './game/GamePage';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showGame, setShowGame] = useState(false);

  return (
    <ThemeProvider>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Game overlay — full screen, di atas website */}
      {showGame && (
        <GamePage onHome={() => setShowGame(false)} />
      )}

      {/* Website utama */}
      <div
        className="overflow-x-hidden"
        style={{
          background: 'var(--bg-base)',
          color: 'var(--text-primary)',
          overflow: showSplash ? 'hidden' : undefined,
          height: showSplash ? '100vh' : undefined,
        }}
      >
        <Header onPlayGame={() => setShowGame(true)} />
        <Hero onPlayGame={() => setShowGame(true)} />
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
