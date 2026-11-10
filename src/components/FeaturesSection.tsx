import React from 'react';
import { MonitorSmartphone, Zap, ShieldCheck, Sparkles, Globe2, Compass } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Zap className="text-cyan-400" size={24} />,
      title: 'Zero Download & Instalação',
      description:
        'Clique e jogue na hora. Não consome espaço no seu disco e não exige nenhum emulador pesado.',
      accent: 'from-cyan-500/20 to-blue-500/5',
      border: 'border-cyan-500/20',
    },
    {
      icon: <Globe2 className="text-purple-400" size={24} />,
      title: 'Mundo Subway Surfers',
      description:
        'Acesse versões lendárias como Barcelona, colaboração especial Brawl Stars e o clássico original.',
      accent: 'from-purple-500/20 to-pink-500/5',
      border: 'border-purple-500/20',
    },
    {
      icon: <MonitorSmartphone className="text-sky-400" size={24} />,
      title: 'Compatível com Tudo',
      description:
        'Jogue pelo computador usando o teclado ou no celular usando toques na tela com a mesma fluidez.',
      accent: 'from-sky-500/20 to-indigo-500/5',
      border: 'border-sky-500/20',
    },
    {
      icon: <ShieldCheck className="text-emerald-400" size={24} />,
      title: '100% Gratuito & Seguro',
      description:
        'Sem cobranças, sem cadastros forçados e sem barreiras. Diversão pura direto da fonte.',
      accent: 'from-emerald-500/20 to-teal-500/5',
      border: 'border-emerald-500/20',
    },
  ];

  return (
    <section id="vantagens" className="py-20 sm:py-28 relative bg-[#0b0e17]/60 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold tracking-widest uppercase mb-4">
            <Sparkles size={14} className="text-cyan-400" />
            <span>Por Que o SurfPlay?</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
            A MELHOR EXPERIÊNCIA NO NAVEGADOR
          </h2>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            Criado por apaixonados por jogos para oferecer acesso descomplicado, rápido e com visual de alto nível.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`p-6 sm:p-7 rounded-3xl bg-slate-900/60 border ${feature.border} relative overflow-hidden backdrop-blur-sm group hover:-translate-y-1 transition-all duration-300`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.accent} rounded-full blur-2xl -z-10 group-hover:scale-125 transition-transform duration-500`} />
              
              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 w-fit mb-5 shadow-sm">
                {feature.icon}
              </div>

              <h3 className="font-display text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                {feature.title}
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed font-normal">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
