/**
 * WOCHA SHOWCASE & THREE CORE COLLECTIONS:
 * 1. Streetwear
 * 2. Gym Wear
 * 3. Normal Wear
 */

export interface ShowcaseProduct {
  id: string;
  name: string;
  category: 'streetwear' | 'gym-wear' | 'normal-wear' | 'designer-choice' | 'winter-wear' | 'hoodies' | 't-shirts' | 'drop-shoulder' | 'anime-prints' | 'acid-wash';
  collection: 'streetwear' | 'gym-wear' | 'normal-wear' | 'designer-choice' | 'winter-wear';
  categoryLabel: string;
  image: string;
  hoverImage?: string;
  images?: string[];
  priceUSD: number;
  priceINR: number;
  compareAtUSD?: number;
  compareAtINR?: number;
  weight?: string;
  composition: string;
  fit: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  isNewRelease?: boolean;
  tag?: string;
  productSlug?: string;
}

export interface ComingSoonProduct {
  id: string;
  name: string;
  category: 'streetwear' | 'gym-wear' | 'normal-wear' | 'drop-shoulder' | 'hoodies' | 'anime-prints' | 'acid-wash';
  categoryLabel: string;
  image: string;
  launchWindow: string;
  estimatedPriceUSD: number;
  estimatedPriceINR: number;
  weight?: string;
  fit: string;
  description: string;
  printTechnique?: string;
  previewTag: string;
}

/* =========================================================================
   1. STREETWEAR COLLECTION
   ========================================================================= */
export const STREETWEAR_PRODUCTS: ShowcaseProduct[] = [
  {
    id: 'sw-01',
    name: 'F1 Red Bull Racing Drop-Shoulder Tee',
    category: 'streetwear',
    collection: 'streetwear',
    categoryLabel: 'Streetwear',
    image: '/street wear/f1-redbull/1.png',
    hoverImage: '/street wear/f1-redbull/2.png',
    images: [
      '/street wear/f1-redbull/1.png',
      '/street wear/f1-redbull/2.png',
      '/street wear/f1-redbull/3.png',
      '/street wear/f1-redbull/4.png',
    ],
    priceUSD: 55,
    priceINR: 999,
    compareAtUSD: 65,
    compareAtINR: 2499,
    composition: '100% Combed Heavy Cotton (260 GSM)',
    fit: 'Relaxed Drop Shoulder',
    colors: [
      { name: 'Navy Racing', hex: '#001A30' },
      { name: 'Pitch Black', hex: '#111111' },
      { name: 'Bone White', hex: '#EBE9E1' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    isNewRelease: true,
    tag: 'Best Seller',
    productSlug: 'f1-redbull-tee',
  },
  {
    id: 'sw-03',
    name: 'Hot Wheels Vintage Graphic Street Tee',
    category: 'streetwear',
    collection: 'streetwear',
    categoryLabel: 'Streetwear',
    image: '/street wear/hotwheels/1.png',
    hoverImage: '/street wear/hotwheels/2.png',
    images: [
      '/street wear/hotwheels/1.png',
      '/street wear/hotwheels/2.png',
      '/street wear/hotwheels/3.png',
      '/street wear/hotwheels/4.png',
    ],
    priceUSD: 49,
    priceINR: 999,
    compareAtUSD: 59,
    compareAtINR: 2499,
    composition: '100% Combed Ring-Spun Cotton',
    fit: 'Relaxed Drop Shoulder',
    colors: [
      { name: 'Chalk White', hex: '#FAF9F6' },
      { name: 'Jet Black', hex: '#111111' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isNewRelease: true,
    tag: 'Limited Edition',
    productSlug: 'hot-wheels-tee',
  },
  {
    id: 'sw-02',
    name: 'Holy Spirit Heavyweight Graphic Tee',
    category: 'streetwear',
    collection: 'streetwear',
    categoryLabel: 'Streetwear',
    image: '/street wear/holy-sprit/1.png',
    hoverImage: '/street wear/holy-sprit/2.png',
    images: [
      '/street wear/holy-sprit/1.png',
      '/street wear/holy-sprit/2.png',
      '/street wear/holy-sprit/3.png',
    ],
    priceUSD: 52,
    priceINR: 999,
    compareAtUSD: 60,
    compareAtINR: 2499,
    composition: '100% Heavy Organic Cotton (280 GSM)',
    fit: 'Oversized Boxy Cut',
    colors: [
      { name: 'Pitch Black', hex: '#111111' },
      { name: 'Vintage Washed', hex: '#2B2B2B' },
      { name: 'Off-White', hex: '#F3F2EC' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    isNewRelease: true,
    tag: 'New Drop',
    productSlug: 'holy-spirit-tee',
  },
  {
    id: 'sw-04',
    name: 'WOCHA Racing Graphic Track Jacket',
    category: 'streetwear',
    collection: 'streetwear',
    categoryLabel: 'Streetwear',
    image: '/street wear/jacket/1.png',
    hoverImage: '/street wear/jacket/2.png',
    images: [
      '/street wear/jacket/1.png',
      '/street wear/jacket/2.png',
      '/street wear/jacket/3.png',
    ],
    priceUSD: 52,
    priceINR: 999,
    compareAtUSD: 60,
    compareAtINR: 2499,
    composition: '100% Heavyweight Technical Poly-Cotton Blend',
    fit: 'Motorsport Boxy Silhouette',
    colors: [
      { name: 'Motorsport Black', hex: '#111111' },
      { name: 'Charcoal', hex: '#222222' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isNewRelease: true,
    tag: 'Collector Series',
    productSlug: 'racing-jacket',
  },
  {
    id: 'sw-05',
    name: '"Told GPT" Oversized Graphic Street Tee',
    category: 'streetwear',
    collection: 'streetwear',
    categoryLabel: 'Streetwear',
    image: '/street wear/toldgpt/1.png',
    hoverImage: '/street wear/toldgpt/2.png',
    images: [
      '/street wear/toldgpt/1.png',
      '/street wear/toldgpt/2.png',
      '/street wear/toldgpt/3.png',
    ],
    priceUSD: 52,
    priceINR: 999,
    compareAtUSD: 60,
    compareAtINR: 2499,
    composition: '100% Combed Cotton (260 GSM)',
    fit: 'Oversized Boxy Cut',
    colors: [
      { name: 'Vintage Black', hex: '#141414' },
      { name: 'Washed Grey', hex: '#333333' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isNewRelease: true,
    tag: 'Special Edition',
    productSlug: 'told-gpt-tee',
  },
];

/* =========================================================================
   2. GYM WEAR COLLECTION
   ========================================================================= */
export const GYM_WEAR_PRODUCTS: ShowcaseProduct[] = [
  {
    id: 'gw-01',
    name: 'Sports Drop-Shoulder Oversized Gym Tee',
    category: 'gym-wear',
    collection: 'gym-wear',
    categoryLabel: 'Gym Wear',
    image: '/gym wear/SPORTS-DROPSHOULDER/1.png',
    hoverImage: '/gym wear/SPORTS-DROPSHOULDER/2.png',
    images: [
      '/gym wear/SPORTS-DROPSHOULDER/1.png',
      '/gym wear/SPORTS-DROPSHOULDER/2.png',
      '/gym wear/SPORTS-DROPSHOULDER/3.png',
    ],
    priceUSD: 48,
    priceINR: 999,
    compareAtUSD: 58,
    compareAtINR: 2499,
    composition: '100% Breathable Athletic Heavy Cotton (260 GSM)',
    fit: 'Oversized Pump Cover',
    colors: [
      { name: 'Matte Black', hex: '#111111' },
      { name: 'Cement Grey', hex: '#8F9194' },
      { name: 'Army Olive', hex: '#3E4437' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    isNewRelease: true,
    tag: 'Best Seller',
    productSlug: 'sports-dropshoulder-tee',
  },
  {
    id: 'gw-02',
    name: 'Iron Core Performance Heavy Athletic Tee',
    category: 'gym-wear',
    collection: 'gym-wear',
    categoryLabel: 'Gym Wear',
    image: '/gym wear/gym-wear-2/1.png',
    hoverImage: '/gym wear/gym-wear-2/2.png',
    images: [
      '/gym wear/gym-wear-2/1.png',
      '/gym wear/gym-wear-2/2.png',
      '/gym wear/gym-wear-2/3.png',
    ],
    priceUSD: 46,
    priceINR: 999,
    compareAtUSD: 55,
    compareAtINR: 2499,
    composition: 'Premium Engineered Sweat-Wicking Blend',
    fit: 'Athletic Tapered Cut',
    colors: [
      { name: 'Iron Black', hex: '#181818' },
      { name: 'Steel Grey', hex: '#636569' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    isNewRelease: true,
    tag: 'New Release',
    productSlug: 'iron-core-tee',
  },
  {
    id: 'gw-03',
    name: 'Pro Series Athletic Heavyweight Tee',
    category: 'gym-wear',
    collection: 'gym-wear',
    categoryLabel: 'Gym Wear',
    image: '/gym wear/gym-wear-3/1.png',
    hoverImage: '/gym wear/gym-wear-3/2.png',
    images: [
      '/gym wear/gym-wear-3/1.png',
      '/gym wear/gym-wear-3/2.png',
    ],
    priceUSD: 49,
    priceINR: 2699,
    compareAtUSD: 59,
    compareAtINR: 3199,
    composition: '100% Breathable Athletic Heavy Cotton (260 GSM)',
    fit: 'Oversized Athletic Cut',
    colors: [
      { name: 'Matte Black', hex: '#111111' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    isNewRelease: true,
    tag: 'New Drop',
    productSlug: 'gym-wear-3-tee',
  },
];

/* =========================================================================
   3. NORMAL WEAR COLLECTION (DEPRECATED - REMOVED UNSPLASH PLACEHOLDERS)
   ========================================================================= */
export const NORMAL_WEAR_PRODUCTS: ShowcaseProduct[] = [];


/* =========================================================================
   4. DESIGNER'S CHOICE COLLECTION (Replaces Winter Wear)
   ========================================================================= */
export const DESIGNER_CHOICE_PRODUCTS: ShowcaseProduct[] = [
  {
    id: 'dc-01',
    name: 'Atelier Boxy Heavyweight Black Tee',
    category: 'designer-choice',
    collection: 'designer-choice',
    categoryLabel: "Designer's Choice",
    image: '/Desing wear/black-shirt/1.png',
    hoverImage: '/Desing wear/black-shirt/2.png',
    images: [
      '/Desing wear/black-shirt/1.png',
      '/Desing wear/black-shirt/2.png',
      '/Desing wear/black-shirt/3.png',
      '/Desing wear/black-shirt/4.png',
    ],
    priceUSD: 58,
    priceINR: 3199,
    compareAtUSD: 68,
    compareAtINR: 3699,
    composition: '100% Luxury Weight Organic Cotton (300 GSM)',
    fit: 'Architectural Boxy Cut',
    colors: [
      { name: 'Onyx Black', hex: '#111111' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    isNewRelease: true,
    tag: "Designer's Pick",
    productSlug: 'designer-black-tee',
  },
  {
    id: 'dc-02',
    name: 'Bespoke Full-Sleeve Heavyweight Layer',
    category: 'designer-choice',
    collection: 'designer-choice',
    categoryLabel: "Designer's Choice",
    image: '/Desing wear/full sleve/1.png',
    hoverImage: '/Desing wear/full sleve/2.png',
    images: [
      '/Desing wear/full sleve/1.png',
      '/Desing wear/full sleve/2.png',
    ],
    priceUSD: 68,
    priceINR: 3699,
    compareAtUSD: 78,
    compareAtINR: 4199,
    composition: '100% Combed Heavy Cotton with Ribbed Cuffs',
    fit: 'Relaxed Full-Sleeve Silhouette',
    colors: [
      { name: 'Pitch Black', hex: '#111111' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isNewRelease: true,
    tag: 'Limited Atelier',
    productSlug: 'designer-full-sleeve',
  },
  {
    id: 'dc-03',
    name: 'Crimson Atelier Washed Heavy Tee',
    category: 'designer-choice',
    collection: 'designer-choice',
    categoryLabel: "Designer's Choice",
    image: '/Desing wear/red-shirt/1.png',
    hoverImage: '/Desing wear/red-shirt/2.png',
    images: [
      '/Desing wear/red-shirt/1.png',
      '/Desing wear/red-shirt/2.png',
      '/Desing wear/red-shirt/3.png',
      '/Desing wear/red-shirt/4.png',
    ],
    priceUSD: 58,
    priceINR: 3199,
    compareAtUSD: 68,
    compareAtINR: 3699,
    composition: '100% Garment-Dyed Heavy Cotton (280 GSM)',
    fit: 'Boxy Drop Shoulder',
    colors: [
      { name: 'Deep Crimson', hex: '#8B0000' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    isNewRelease: true,
    tag: 'Archive Drop',
    productSlug: 'designer-red-tee',
  },
  {
    id: 'dc-04',
    name: 'Thrift Graphic Archive Heavyweight Tee',
    category: 'designer-choice',
    collection: 'designer-choice',
    categoryLabel: "Designer's Choice",
    image: '/Desing wear/trift-desing/1.png',
    hoverImage: '/Desing wear/trift-desing/2.png',
    images: [
      '/Desing wear/trift-desing/1.png',
      '/Desing wear/trift-desing/2.png',
    ],
    priceUSD: 62,
    priceINR: 3399,
    compareAtUSD: 72,
    compareAtINR: 3899,
    composition: '100% Vintage Washed Heavy Cotton',
    fit: 'Vintage Oversized Fit',
    colors: [
      { name: 'Washed Charcoal', hex: '#222222' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isNewRelease: true,
    tag: 'Archive Release',
    productSlug: 'designer-thrift-tee',
  },
];

// Backward-compatible alias for any legacy imports
export const WINTER_WEAR_PRODUCTS: ShowcaseProduct[] = DESIGNER_CHOICE_PRODUCTS;

/* Combined catalog for all items view */
export const AVAILABLE_SHOWCASE_PRODUCTS: ShowcaseProduct[] = [
  ...STREETWEAR_PRODUCTS,
  ...GYM_WEAR_PRODUCTS,
  ...DESIGNER_CHOICE_PRODUCTS,
];

export const COMING_SOON_PRODUCTS: ComingSoonProduct[] = [
  {
    id: 'cs-01',
    name: 'Cyber Samurai Graphic Oversized T-Shirt',
    category: 'streetwear',
    categoryLabel: 'Streetwear',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
    launchWindow: 'Friday, 8:00 PM',
    estimatedPriceUSD: 54,
    estimatedPriceINR: 2999,
    fit: 'Oversized Drop-Shoulder',
    description: 'Detailed colorful back graphic print on heavy cotton. Super soft feel that will not crack or peel in the wash.',
    printTechnique: 'High-Density Screenprint',
    previewTag: 'Only 150 Made',
  },
  {
    id: 'cs-02',
    name: 'Super-Warm Fleece Pullover Hoodie',
    category: 'streetwear',
    categoryLabel: 'Streetwear',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
    launchWindow: 'Coming Next Week',
    estimatedPriceUSD: 135,
    estimatedPriceINR: 7499,
    fit: 'Roomy Relaxed Fit',
    description: 'Our thickest and warmest hoodie yet. Double stitched along all seams with extra strong cuffs and waist.',
    printTechnique: 'Clean Minimal Front Stitch',
    previewTag: 'Winter Special',
  },
  {
    id: 'cs-03',
    name: 'Sun-Faded Vintage Wash Workout Tee',
    category: 'gym-wear',
    categoryLabel: 'Gym Wear',
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1000&q=80',
    launchWindow: 'Coming Soon',
    estimatedPriceUSD: 49,
    estimatedPriceINR: 2699,
    fit: 'Athletic Cut',
    description: 'Washed with natural minerals to give it a worn-in vintage look and an ultra-soft feel right out of the box.',
    printTechnique: 'Vintage Mineral Wash',
    previewTag: 'Limited Edition',
  },
  {
    id: 'cs-04',
    name: 'Everyday Relaxed Button Overshirt',
    category: 'normal-wear',
    categoryLabel: 'Normal Wear',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80',
    launchWindow: 'End of This Month',
    estimatedPriceUSD: 85,
    estimatedPriceINR: 4599,
    fit: 'Relaxed Daily Fit',
    description: 'Durable cotton canvas overshirt with double front chest pockets and reinforced horn buttons.',
    printTechnique: 'Washed Canvas',
    previewTag: 'Early Access',
  },
];
