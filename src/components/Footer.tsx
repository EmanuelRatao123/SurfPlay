import React from 'react';
import { Logo } from './Logo';
import { ShieldAlert, Heart, Compass } from 'lucide-react';
import { SUBWAY_MAPS } from '../data/maps';

interface FooterProps {
  onOpenControls: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenControls }) => {
  const currentYear = new Date().getFullYear();

  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-[#07090f] border-t border-slate-800/80 pt-16 pb-12 overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-gradient-to-t from-cyan-500/10 via-purple-600/5 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand info */}
          <div className="md:col-span-6 space-y-4">
            <a
              href="#inicio"
              onClick={(e) => {
                e.preventDefault();
                handleScroll('#inicio');
              }}
              className="inline-block"
              aria-label="SurfPlay - Início"
            >
              <Logo size="lg" />
            </a>
            
            <p className="text-xl font-display font-semibold text-cyan-300">
              Sua diversão começa aqui.
            </p>

            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              O SurfPlay é o ponto de encontro de fãs de Subway Surfers para explorar diferentes mapas, edições especiais e clássicas diretamente pelo navegador em qualquer dispositivo.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Navegação
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a
                  href="#inicio"
                  onClick={(e) => {
                    e.preventDefault();
                    handleScroll('#inicio');
                  }}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Início
                </a>
              </li>
              <li>
                <a
                  href="#mapas"
                  onClick={(e) => {
                    e.preventDefault();
                    handleScroll('#mapas');
                  }}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Mapas Disponíveis
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenControls}
                  className="hover:text-cyan-400 transition-colors cursor-pointer text-left"
                >
                  Guia de Controles (Como Jogar)
                </button>
              </li>
              <li>
                <a
                  href="#vantagens"
                  onClick={(e) => {
                    e.preventDefault();
                    handleScroll('#vantagens');
                  }}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Vantagens do SurfPlay
                </a>
              </li>
            </ul>
          </div>

          {/* Map Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Edições em Destaque
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {SUBWAY_MAPS.slice(0, 5).map((m) => (
                <li key={m.id}>
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-cyan-400 transition-colors inline-flex items-center gap-1.5"
                  >
                    <Compass size={14} className="text-cyan-500 shrink-0" />
                    <span>Subway Surfers: {m.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          {/* Disclaimer (Mandatory) */}
          <div className="flex items-start gap-2 max-w-2xl text-left bg-slate-900/50 p-3.5 rounded-xl border border-slate-800/80">
            <ShieldAlert size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-slate-300">Aviso Legal:</strong> O SurfPlay é uma plataforma independente e não é afiliada oficialmente aos desenvolvedores dos jogos. Todas as marcas, imagens e jogos pertencem aos seus respectivos proprietários.
            </p>
          </div>

          {/* Copyright with dynamic year */}
          <div className="text-center md:text-right shrink-0">
            <p className="font-medium text-slate-400">
              © {currentYear} <strong className="text-white">SurfPlay</strong>. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
