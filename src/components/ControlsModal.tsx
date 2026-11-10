import React, { useEffect } from 'react';
import { X, Gamepad2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface ControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ControlsModal: React.FC<ControlsModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="controls-title"
    >
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl shadow-cyan-500/10 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Gamepad2 size={24} />
            </div>
            <div>
              <h3 id="controls-title" className="font-display text-xl sm:text-2xl font-bold text-white">
                Como Jogar Subway Surfers
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Guia oficial de controles para teclado e celular
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            aria-label="Fechar guia de controles"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Keyboard Controls Visualizer */}
          <div>
            <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles size={16} />
              Controles no Computador (Teclado)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Jump */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white shadow-inner">
                    W
                  </span>
                  <span className="text-xs text-slate-500">ou</span>
                  <span className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white shadow-inner">
                    <ArrowUp size={18} />
                  </span>
                </div>
                <span className="font-semibold text-sm text-slate-200">Pular Obstáculos</span>
              </div>

              {/* Roll / Slide */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white shadow-inner">
                    S
                  </span>
                  <span className="text-xs text-slate-500">ou</span>
                  <span className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white shadow-inner">
                    <ArrowDown size={18} />
                  </span>
                </div>
                <span className="font-semibold text-sm text-slate-200">Deslizar / Rolar</span>
              </div>

              {/* Move Left */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white shadow-inner">
                    A
                  </span>
                  <span className="text-xs text-slate-500">ou</span>
                  <span className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white shadow-inner">
                    <ArrowLeft size={18} />
                  </span>
                </div>
                <span className="font-semibold text-sm text-slate-200">Mover para Esquerda</span>
              </div>

              {/* Move Right */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white shadow-inner">
                    D
                  </span>
                  <span className="text-xs text-slate-500">ou</span>
                  <span className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white shadow-inner">
                    <ArrowRight size={18} />
                  </span>
                </div>
                <span className="font-semibold text-sm text-slate-200">Mover para Direita</span>
              </div>

              {/* Spacebar Hoverboard */}
              <div className="sm:col-span-2 flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-cyan-500/30">
                <div className="flex items-center gap-2">
                  <span className="h-10 px-5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 border border-cyan-400/50 flex items-center justify-center font-bold text-white text-xs uppercase shadow-sm">
                    Espaço (Space)
                  </span>
                </div>
                <span className="font-semibold text-sm text-cyan-200">Ativar Prancha de Surf (Hoverboard)</span>
              </div>
            </div>
          </div>

          {/* Mobile Gestures */}
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              No Celular ou Tablet (Toque na Tela)
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              Deslize o dedo para cima, baixo, esquerda ou direita na tela para realizar as ações. Toque duas vezes rápido para ativar o hoverboard.
            </p>
          </div>

          {/* Pro Tips */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Dicas para Bater Recordes
            </h4>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-cyan-400 mt-0.5 shrink-0" />
                <span>Use o hoverboard para ganhar uma vida extra caso bata em um obstáculo.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-cyan-400 mt-0.5 shrink-0" />
                <span>Colete o Jetpack e o Super Tênis para alcançar tetos de trens e moedas suspensas.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-cyan-400 mt-0.5 shrink-0" />
                <span>Alterne entre deslizar e pular no ar para cancelar movimentos bruscos.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer"
          >
            Entendi, vamos jogar!
          </button>
        </div>
      </div>
    </div>
  );
};
