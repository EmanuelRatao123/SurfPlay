export interface GameMap {
  id: string;
  name: string;
  description: string;
  image: string;
  url: string;
  category?: string;
  featured?: boolean;
  badge?: string;
  tags?: string[];
  themeColor?: string; // Accent color hex or tailwind class
}

export type MapFilterCategory = 'all' | 'featured' | string;
