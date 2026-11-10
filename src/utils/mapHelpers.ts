import { GameMap } from '../types/map';

/**
 * Filter maps based on search query, category, and favorite list.
 */
export function filterMaps(
  maps: GameMap[],
  options: {
    query?: string;
    category?: string;
    onlyFavorites?: boolean;
    favoriteIds?: string[];
  }
): GameMap[] {
  const { query = '', category = 'all', onlyFavorites = false, favoriteIds = [] } = options;
  const cleanQuery = query.trim().toLowerCase();

  return maps.filter((map) => {
    // Search query match (name, description, or tags)
    if (cleanQuery) {
      const matchName = map.name.toLowerCase().includes(cleanQuery);
      const matchDesc = map.description.toLowerCase().includes(cleanQuery);
      const matchTags = map.tags?.some((t) => t.toLowerCase().includes(cleanQuery)) ?? false;
      const matchCategory = map.category?.toLowerCase().includes(cleanQuery) ?? false;

      if (!matchName && !matchDesc && !matchTags && !matchCategory) {
        return false;
      }
    }

    // Category filter
    if (category === 'featured') {
      if (!map.featured) return false;
    } else if (category && category !== 'all') {
      if (map.category !== category) return false;
    }

    // Favorites filter
    if (onlyFavorites) {
      if (!favoriteIds.includes(map.id)) return false;
    }

    return true;
  });
}

/**
 * Extract unique categories from a list of maps.
 */
export function getUniqueCategories(maps: GameMap[]): string[] {
  const categories = new Set<string>();
  for (const map of maps) {
    if (map.category) {
      categories.add(map.category);
    }
  }
  return Array.from(categories);
}

/**
 * Validate map object structure to ensure future additions conform to expectations.
 */
export function isValidMap(map: Partial<GameMap>): boolean {
  if (!map.id || typeof map.id !== 'string') return false;
  if (!map.name || typeof map.name !== 'string') return false;
  if (!map.description || typeof map.description !== 'string') return false;
  if (!map.image || typeof map.image !== 'string') return false;
  if (!map.url || typeof map.url !== 'string') return false;

  try {
    const parsed = new URL(map.url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;
  } catch {
    return false;
  }

  return true;
}
