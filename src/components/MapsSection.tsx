import React, { useState, useMemo } from 'react';
import { SUBWAY_MAPS } from '../data/maps';
import { filterMaps, getUniqueCategories } from '../utils/mapHelpers';
import { MapCard } from './MapCard';
import { Search, Sparkles, Heart, Compass, X } from 'lucide-react';

interface MapsSectionProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const MapsSection: React.FC<MapsSectionProps> = ({
  favorites,
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const categories = useMemo(() => getUniqueCategories(SUBWAY_MAPS), []);

  const filteredMaps = useMemo(() => {
    return filterMaps(SUBWAY_MAPS, {
      query: searchQuery,
      category: selectedCategory,
      onlyFavorites,
      favoriteIds: favorites,
    });
  }, [searchQuery, selectedCategory, onlyFavorites, favorites]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setOnlyFavorites(false);
  };

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all' || onlyFavorites;

  return (
    <section id="mapas" className="relative py-20 sm:py-28 bg-[#0b0e17]">
      {/* Background Subtle Gradient */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">
            <Compass size={14} className="text-cyan-400" />
            <span>Coleção de Destinos</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white mb-4">
            ESCOLHA SEU MAPA
          </h2>

          <p className="text-lg sm:text-xl text-slate-300 font-medium">
            Qual será sua próxima aventura?
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 p-2 sm:p-3 bg-slate-900/70 border border-slate-800/80 rounded-2xl backdrop-blur-md">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar mapa, cidade ou tema..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/60 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
              aria-label="Buscar mapa por nome ou tema"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                aria-label="Limpar busca"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setOnlyFavorites(false);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === 'all' && !onlyFavorites
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Todos ({SUBWAY_MAPS.length})
            </button>

            <button
              onClick={() => {
                setSelectedCategory('featured');
                setOnlyFavorites(false);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === 'featured' && !onlyFavorites
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles size={14} className="text-cyan-300" />
              Destaques
            </button>

            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setOnlyFavorites(false);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat && !onlyFavorites
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}

            <button
              onClick={() => {
                setOnlyFavorites(!onlyFavorites);
                if (!onlyFavorites) setSelectedCategory('all');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                onlyFavorites
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25 ring-1 ring-rose-400/40'
                  : 'bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Heart
                size={14}
                className={onlyFavorites ? 'fill-white text-white' : 'text-rose-400'}
              />
              Favoritos ({favorites.length})
            </button>
          </div>
        </div>

        {/* Results Counter & Active Filter Badge */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400 mb-6 px-1">
          <div>
            Exibindo <span className="font-bold text-white">{filteredMaps.length}</span> {filteredMaps.length === 1 ? 'mapa' : 'mapas'}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-cyan-400 hover:text-cyan-300 font-medium underline flex items-center gap-1"
            >
              <X size={14} />
              Limpar filtros
            </button>
          )}
        </div>

        {/* Maps Grid */}
        {filteredMaps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredMaps.map((map, index) => (
              <MapCard
                key={map.id}
                map={map}
                isFavorite={favorites.includes(map.id)}
                onToggleFavorite={onToggleFavorite}
                index={index}
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-slate-800/60">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400">
              <Compass size={32} />
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">Nenhum mapa encontrado</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6">
              Não encontramos nenhum mapa correspondente a sua busca atual. Tente buscar por outro termo ou limpe os filtros.
            </p>
            <button
              onClick={clearFilters}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Ver todos os mapas
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
