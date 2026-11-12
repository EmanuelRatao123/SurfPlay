import { GameMap } from '../types/map';

/**
 * Catálogo Central de Mapas do SurfPlay
 * 
 * Para adicionar um novo mapa no futuro, basta inserir um novo objeto nesta lista:
 * {
 *   id: 'identificador-unico',
 *   name: 'Nome do Mapa',
 *   description: 'Breve descrição atrativa do mapa',
 *   image: 'URL da imagem oficial',
 *   url: 'URL de destino para jogar',
 *   category: 'Cidades' | 'Especiais' | 'Clássicos' | etc.,
 *   featured: true | false,
 *   badge: 'Em Alta' | 'Novo' | 'Favorito da Comunidade',
 *   tags: ['Tag 1', 'Tag 2']
 * }
 */
export const SUBWAY_MAPS: GameMap[] = [
  {
    id: 'barcelona',
    name: 'Barcelona',
    description: 'Explore as ruas e os cenários de Barcelona nesta edição de Subway Surfers.',
    image: '/assets/aistudio/image_18c8fe0e.png',
    url: 'https://morrowplay.com/play/subway-surfers/barcelona/?edition=barcelona&mode=original',
    category: 'Cidades',
    featured: true,
    badge: 'Destaque',
    tags: ['Espanha', 'Europa', 'Ruas Históricas'],
    themeColor: '#f59e0b', // Vibrant amber/gold
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Volte às origens e aproveite a experiência clássica de Subway Surfers.',
    image: '/assets/aistudio/image_a51dbfcd.png',
    url: 'https://morrowplay.com/play/subway-surfers/classic/?edition=classic&mode=original',
    category: 'Clássicos',
    featured: true,
    badge: 'Original',
    tags: ['Nostalgia', 'Trilhos', 'Retrô'],
    themeColor: '#06b6d4', // Vibrant cyan
  },
  {
    id: 'brawl-stars',
    name: 'Brawl Stars',
    description: 'Uma edição especial de Subway Surfers com temática de Brawl Stars.',
    image: '/assets/aistudio/image_e0202842.png',
    url: 'https://morrowplay.com/play/subway-surfers/brawl-stars-season/?edition=brawl-stars-season&mode=original',
    category: 'Especiais',
    featured: true,
    badge: 'Edição Especial',
    tags: ['Crossover', 'Ação', 'Exclusivo'],
    themeColor: '#8b5cf6', // Vibrant purple
  },
  {
    id: 'arabia',
    name: 'Arabia',
    description: 'Corra pelas ruas mágicas do Oriente Médio, palácios e mercados encantadores.',
    image: '/assets/aistudio/image_f04f1387.png',
    url: 'https://morrowplay.com/play/subway-surfers/arabia/?edition=arabia&mode=original',
    category: 'Cidades',
    featured: true,
    badge: 'Oriente Médio',
    tags: ['Deserto', 'Palácios', 'As Mil e Uma Noites'],
    themeColor: '#eab308', // Amber/gold
  },
  {
    id: 'copenhagen-super-runner',
    name: 'Copenhagen Super Runner',
    description: 'Acelere pelas ruas iluminadas em neon de Copenhagen nesta edição Super Runner cheia de adrenalina.',
    image: '/assets/aistudio/image_71baf9ad.png',
    url: 'https://morrowplay.com/play/subway-surfers/copenhagen-super-runner/?edition=copenhagen-super-runner&mode=original',
    category: 'Especiais',
    featured: true,
    badge: 'Super Runner',
    tags: ['Neon', 'Velocidade', 'Futurista'],
    themeColor: '#a855f7', // Electric purple
  },
  {
    id: 'cosmic-crossroads',
    name: 'Cosmic Crossroads',
    description: 'Uma viagem intergaláctica sobre trilhos espaciais, planetas misteriosos e estações cósmicas.',
    image: '/assets/aistudio/image_c55555fc.png',
    url: 'https://morrowplay.com/play/subway-surfers/cosmic-crossroads/?edition=cosmic-crossroads&mode=original',
    category: 'Especiais',
    featured: true,
    badge: 'Galáctico',
    tags: ['Espaço', 'Cosmos', 'Sci-Fi'],
    themeColor: '#ec4899', // Cosmic Pink
  },
  {
    id: 'buenos-aires',
    name: 'Buenos Aires',
    description: 'Descubra o charme e a energia vibrante da Argentina correndo pelos bairros coloridos de Buenos Aires.',
    image: '/assets/aistudio/image_006a31e0.png',
    url: 'https://morrowplay.com/play/subway-surfers/buenos-aires/?edition=buenos-aires&mode=original',
    category: 'Cidades',
    featured: true,
    badge: 'América do Sul',
    tags: ['Argentina', 'Tango', 'Cultura'],
    themeColor: '#0284c7', // Sky Blue
  },
];
