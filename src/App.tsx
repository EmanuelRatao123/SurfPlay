import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MapsSection } from './components/MapsSection';
import { FeaturesSection } from './components/FeaturesSection';
import { ControlsModal } from './components/ControlsModal';
import { Footer } from './components/Footer';

export default function App() {
  const [controlsOpen, setControlsOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('surfplay_favorites');
      return saved ? JSON.parse(saved) : ['barcelona']; // Pre-populate with one favorite for delight
    } catch {
      return ['barcelona'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('surfplay_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed to save favorites to localStorage', e);
    }
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0e17] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Navbar Header */}
      <Navbar onOpenControls={() => setControlsOpen(true)} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onOpenControls={() => setControlsOpen(true)} />

        {/* Maps Section */}
        <MapsSection
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />

        {/* Features / Advantages Section */}
        <FeaturesSection />
      </main>

      {/* Footer */}
      <Footer onOpenControls={() => setControlsOpen(true)} />

      {/* Subway Surfers Controls Modal */}
      <ControlsModal
        isOpen={controlsOpen}
        onClose={() => setControlsOpen(false)}
      />
    </div>
  );
}
