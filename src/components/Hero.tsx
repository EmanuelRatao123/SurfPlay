import React from 'react';
import { Compass, Flame, ShieldCheck, Zap, Sparkles, Play, Gamepad2 } from 'lucide-react';

interface HeroProps {
  onOpenControls: () => void;
  onOpenSupport: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenControls, onOpenSupport }) => {
  const scrollToMaps = () => {
    const mapsSection = document.getElementById('mapas');
    if (mapsSection) {
      mapsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="inicio" className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
      {/* Background Glows & Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[450px] bg-gradient-to-tr from-cyan-500/20 via-blue-600/20 to-purple-600/20 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-12 left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/15 rounded-full blur-[90px] pointer-events-none -z-10" />

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none -z-10 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Gaming Platform Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-6 shadow-lg shadow-cyan-500/10 backdrop-blur-md">
          <Sparkles size={15} className="text-cyan-400 animate-spin-slow" />
          <span>Plataforma Oficial de Mapas Subway Surfers</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        </div>

        {/* Hero Title */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase leading-[1.1] max-w-4xl mx-auto mb-6">
          SEU PRÓXIMO DESTINO É A{' '}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
              DIVERSÃO.
            </span>
            {/* Subtle underline flare */}
            <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur-[1px] opacity-80" />
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-slate-300 font-normal max-w-2xl mx-auto mb-10 leading-relaxed">
          Explore diferentes mapas de <strong className="text-white font-semibold">Subway Surfers</strong> e jogue diretamente pelo navegador.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto mb-14">
          <button
            onClick={scrollToMaps}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-base tracking-wider uppercase text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 ring-1 ring-cyan-300/40 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 group cursor-pointer"
            aria-label="Explorar mapas disponíveis"
          >
            <Compass size={20} className="transition-transform duration-300 group-hover:rotate-45" />
            <span>EXPLORAR MAPAS</span>
          </button>

          <button
            onClick={onOpenControls}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-bold text-sm tracking-wide text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 hover:border-cyan-500/50 shadow-md backdrop-blur-sm transition-all duration-300 cursor-pointer"
            aria-label="Ver guia de como jogar e controles"
          >
            <Gamepad2 size={18} className="text-cyan-400" />
            <span>COMO JOGAR</span>
          </button>

          <button
            onClick={onOpenSupport}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-4 rounded-2xl font-bold text-sm tracking-wide text-sky-300 hover:text-white bg-sky-950/40 hover:bg-sky-900/60 border border-sky-500/40 shadow-md backdrop-blur-sm transition-all duration-300 cursor-pointer"
            aria-label="Abrir suporte"
          >
            <span>SUPORTE</span>
          </button>
        </div>

        {/* Feature Badges / Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto text-left">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/70 backdrop-blur-sm">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Zap size={18} />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Acesso</div>
              <div className="text-sm font-bold text-white">Sem Download</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/70 backdrop-blur-sm">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Flame size={18} />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Desempenho</div>
              <div className="text-sm font-bold text-white">60 FPS Fluido</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/70 backdrop-blur-sm">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Preço</div>
              <div className="text-sm font-bold text-white">100% Gratuito</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/70 backdrop-blur-sm">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Play size={18} />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Plataforma</div>
              <div className="text-sm font-bold text-white">PC & Mobile</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
