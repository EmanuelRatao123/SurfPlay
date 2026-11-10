import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X, Compass, Gamepad2, Info, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenControls: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenControls }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Mapas', href: '#mapas' },
    { label: 'Destaques', href: '#destaques' },
    { label: 'Vantagens', href: '#vantagens' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0b0e17]/90 backdrop-blur-md border-b border-slate-800/80 shadow-xl shadow-black/40 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('#inicio');
            }}
            className="group flex items-center transition-transform hover:scale-[1.02]"
            aria-label="SurfPlay - Página Inicial"
          >
            <Logo size="md" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80 backdrop-blur-sm">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="px-4 py-1.5 text-sm font-medium text-slate-300 hover:text-white rounded-full transition-colors hover:bg-slate-800/80"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={onOpenControls}
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-cyan-300 hover:text-cyan-200 rounded-full transition-colors hover:bg-cyan-950/40"
              aria-label="Abrir guia de controles"
            >
              <Gamepad2 size={16} />
              <span>Controles</span>
            </button>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#mapas"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('#mapas');
              }}
              className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40 ring-1 ring-cyan-400/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Compass size={17} className="animate-spin-slow" />
              <span>JOGAR AGORA</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenControls}
              className="p-2 text-cyan-400 bg-slate-900/80 border border-slate-800 rounded-lg hover:bg-slate-800"
              aria-label="Guia de controles"
            >
              <Gamepad2 size={20} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white bg-slate-900/80 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0b0e17]/95 border-b border-slate-800 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 mt-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.href);
              }}
              className="block px-4 py-2.5 text-base font-medium text-slate-200 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenControls();
            }}
            className="w-full flex items-center justify-between px-4 py-2.5 text-base font-medium text-cyan-300 hover:bg-cyan-950/40 rounded-xl transition-colors"
          >
            <span className="flex items-center gap-2">
              <Gamepad2 size={18} />
              Como Jogar (Controles)
            </span>
            <Sparkles size={16} />
          </button>
          <div className="pt-2">
            <a
              href="#mapas"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('#mapas');
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 shadow-lg shadow-cyan-500/20"
            >
              <Compass size={18} />
              EXPLORAR MAPAS
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
