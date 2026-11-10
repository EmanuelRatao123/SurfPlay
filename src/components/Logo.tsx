import React from 'react';
import { Gamepad2, Zap } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const iconSize = size === 'sm' ? 20 : size === 'lg' ? 32 : 24;
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl';

  return (
    <div className={`flex items-center gap-2.5 font-display font-extrabold tracking-tight select-none ${className}`}>
      {/* Custom Gaming Badge Icon */}
      <div className="relative flex items-center justify-center p-2 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
        <Gamepad2 size={iconSize} className="text-white drop-shadow" />
        <Zap size={iconSize * 0.45} className="absolute -top-1 -right-1 text-yellow-300 fill-yellow-300 animate-pulse" />
      </div>

      {/* Brand Text */}
      <div className={`flex items-baseline ${textSize}`}>
        <span className="text-white font-black tracking-wider">SURF</span>
        <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-400 bg-clip-text text-transparent font-black">
          PLAY
        </span>
      </div>
    </div>
  );
};
