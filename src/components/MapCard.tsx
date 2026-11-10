import React, { useState } from 'react';
import { GameMap } from '../types/map';
import { Play, ExternalLink, Heart, Sparkles, ImageOff } from 'lucide-react';

interface MapCardProps {
  map: GameMap;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  index: number;
}

export const MapCard: React.FC<MapCardProps> = ({
  map,
  isFavorite,
  onToggleFavorite,
  index,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handlePlayClick = (e: React.MouseEvent) => {
    // Stop propagation so if nested button is clicked, parent anchor doesn't double trigger
    e.stopPropagation();
    window.open(map.url, '_blank', 'noopener,noreferrer');
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(map.id);
  };

  return (
    <article
      className="group relative flex flex-col rounded-3xl bg-slate-900/80 border border-slate-800/80 hover:border-cyan-500/50 shadow-xl shadow-black/50 hover:shadow-cyan-500/10 transition-all duration-500 overflow-hidden transform hover:-translate-y-1.5 focus-within:ring-2 focus-within:ring-cyan-400"
      style={{
        animationDelay: `${index * 120}ms`,
      }}
    >
      {/* Clickable Card Link (opens original target URL in new tab) */}
      <a
        href={map.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col h-full focus:outline-none"
        aria-label={`Jogar ${map.name} em nova aba`}
      >
        {/* Image Container with Smooth Zoom and Overlay */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-slate-950">
          {/* Skeleton placeholder while image loads */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-slate-800/80 animate-pulse flex items-center justify-center">
              <span className="text-xs font-medium text-slate-500">Carregando mapa...</span>
            </div>
          )}

          {/* Official Map Image */}
          {!imageError ? (
            <img
              src={map.image}
              alt={`Cenário do mapa ${map.name} Subway Surfers`}
              loading="lazy"
              referrerPolicy="no-referrer"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageLoaded(true);
                setImageError(true);
              }}
              className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ) : (
            /* Styled Thematic Fallback Placeholder when external host blocks hotlinking */
            <div
              className="w-full h-full flex flex-col items-center justify-center p-6 text-center relative overflow-hidden transition-transform duration-700 group-hover:scale-105"
              style={{
                background:
                  map.id === 'barcelona'
                    ? 'linear-gradient(135deg, #7c2d12 0%, #b45309 45%, #1e1b4b 100%)'
                    : map.id === 'brawl-stars'
                    ? 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 45%, #0f172a 100%)'
                    : 'linear-gradient(135deg, #0e7490 0%, #0369a1 45%, #090d16 100%)',
              }}
            >
              {/* Subtle background railway track graphic for authentic Subway Surfers feel */}
              <div className="absolute inset-0 opacity-15 bg-grid-pattern pointer-events-none" />
              <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/10 blur-2xl pointer-events-none" />

              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-lg ring-1 ring-white/20 backdrop-blur-md"
                style={{
                  backgroundColor: `${map.themeColor || '#06b6d4'}25`,
                  color: map.themeColor || '#06b6d4',
                }}
              >
                <Play size={28} className="fill-current translate-x-0.5" />
              </div>

              <span className="font-display font-black text-white text-xl tracking-tight drop-shadow-md">
                {map.name}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-white/80 mt-1">
                Subway Surfers • {map.badge || 'Edição Oficial'}
              </span>
            </div>
          )}

          {/* Dark Gradient Overlay for optimal legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-80" />

          {/* Subtle Top Gradient for Badge Readability */}
          <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

          {/* Top Badges & Actions */}
          <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10">
            {/* Category / Badge Tag */}
            <div className="flex items-center gap-1.5">
              {map.badge && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 backdrop-blur-md shadow-sm">
                  <Sparkles size={12} className="text-cyan-300" />
                  {map.badge}
                </span>
              )}
              {map.category && (
                <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900/80 text-slate-300 border border-slate-700/60 backdrop-blur-md">
                  {map.category}
                </span>
              )}
            </div>

            {/* Favorite Heart Button */}
            <button
              onClick={handleFavoriteClick}
              type="button"
              className={`p-2 rounded-xl backdrop-blur-md transition-all duration-200 border cursor-pointer ${
                isFavorite
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : 'bg-slate-900/70 text-slate-400 hover:text-white border-slate-700/60 hover:bg-slate-800'
              }`}
              title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              aria-label={isFavorite ? `Remover ${map.name} dos favoritos` : `Favoritar ${map.name}`}
            >
              <Heart
                size={17}
                className={isFavorite ? 'fill-rose-500 text-rose-500 transition-transform active:scale-125' : ''}
              />
            </button>
          </div>

          {/* Quick Play Hover Indicator */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="p-4 rounded-full bg-cyan-500/30 border border-cyan-400/50 backdrop-blur-md text-cyan-200 transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-xl shadow-cyan-500/20">
              <Play size={28} className="fill-cyan-200 translate-x-0.5" />
            </div>
          </div>
        </div>

        {/* Card Content & Action */}
        <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between">
          <div>
            {/* Title */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                {map.name}
              </h3>
              <ExternalLink size={16} className="text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0" />
            </div>

            {/* Short Description */}
            <p className="text-sm text-slate-300 font-normal leading-relaxed mb-4 line-clamp-2">
              {map.description}
            </p>

            {/* Tags */}
            {map.tags && map.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {map.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium text-slate-400 px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/50"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Button "JOGAR AGORA" */}
          <div className="pt-2">
            <button
              onClick={handlePlayClick}
              type="button"
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl font-display font-bold text-sm tracking-wider uppercase text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/35 ring-1 ring-cyan-300/30 transition-all duration-300 transform active:scale-[0.98] cursor-pointer"
              aria-label={`Jogar ${map.name} agora`}
            >
              <Play size={16} className="fill-white" />
              <span>JOGAR AGORA</span>
            </button>
          </div>
        </div>
      </a>
    </article>
  );
};
