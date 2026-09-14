/**
 * WOCHA SHOWCASE & NEW LAUNCH RELEASES
 * 
 * Easily edit or add new products, images, names, and pricing below!
 * Supports INR (₹) and USD ($) pricing, plus auto-conversion for EUR/GBP.
 */

export interface ShowcaseProduct {
  id: string;
  name: string;
  category: 'drop-shoulder' | 'hoodies' | 'anime-prints' | 'acid-wash';
  categoryLabel: string;
  /** Primary image URL. Paste your image link or local path here */
  image: string;
  hoverImage?: string;
  /** Price in USD ($) */
  priceUSD: number;
  /** Price in INR (₹) */
  priceINR: number;
  compareAtUSD?: number;
  compareAtINR?: number;
  weight: string; // e.g. '280 GSM'
  composition: string;
  fit: string; // e.g. 'Oversized Drop-Shoulder'
  colors: { name: string; hex: string }[];
  sizes: string[];
  isNewRelease?: boolean;
  tag?: string;
  productSlug?: string;
}

export interface ComingSoonProduct {
  id: string;
  name: string;
  category: 'drop-shoulder' | 'hoodies' | 'anime-prints' | 'acid-wash';
  categoryLabel: string;
  image: string;
  launchWindow: string; // e.g. 'Drops Friday 8:00 PM'
  estimatedPriceUSD: number;
  estimatedPriceINR: number;
  weight: string; // e.g. '300 GSM Heavy Cotton'
  fit: string;
  description: string;
  printTechnique?: string;
  previewTag: string; // e.g. 'Limited Stock'
}

/* =========================================================================
   AVAILABLE NOW (READY TO BUY & SHIP)
   ========================================================================= */
export const AVAILABLE_SHOWCASE_PRODUCTS: ShowcaseProduct[] = [
  // 1. Drop-Shoulder Oversized Tee
  {
    id: 'ds-tee-01',
    name: 'Heavyweight Drop-Shoulder T-Shirt',
    category: 'drop-shoulder',
    categoryLabel: 'Drop Shoulder',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80',
    priceUSD: 45,
    priceINR: 2499,
    compareAtUSD: 55,
    compareAtINR: 2999,
    weight: '280 GSM',
    composition: '100% Heavy Combed Cotton',
    fit: 'Relaxed Drop Shoulder',
    colors: [
      { name: 'Black', hex: '#121212' },
      { name: 'Off-White', hex: '#F3F2EC' },
      { name: 'Dark Grey', hex: '#3E424B' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    isNewRelease: true,
    tag: 'Best Seller',
    productSlug: 'tee-01',
  },

  // 2. Anime Graphic Back-Print Drop Shoulder
  {
    id: 'anime-tee-01',
    name: 'Phantom Ronin Anime Graphic T-Shirt',
    category: 'anime-prints',
    categoryLabel: 'Anime Prints',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
    priceUSD: 52,
    priceINR: 2899,
    weight: '290 GSM',
    composition: '100% Bio-Washed Cotton',
    fit: 'Oversized Fit',
    colors: [
      { name: 'Washed Black', hex: '#1E1E20' },
      { name: 'Cream', hex: '#EAE6DF' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    isNewRelease: true,
    tag: 'New Drop',
    productSlug: 'tee-02',
  },

  // 3. Heavyweight Boxy Loopback Hoodie
  {
    id: 'hoodie-01',
    name: 'Heavyweight Boxy Cotton Hoodie',
    category: 'hoodies',
    categoryLabel: 'Hoodies',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80',
    priceUSD: 110,
    priceINR: 5999,
    compareAtUSD: 130,
    compareAtINR: 6999,
    weight: '480 GSM',
    composition: '100% Heavy French Terry Cotton',
    fit: 'Boxy Fit',
    colors: [
      { name: 'Jet Black', hex: '#111111' },
      { name: 'Bone White', hex: '#EBE9E1' },
      { name: 'Brown', hex: '#8B4513' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isNewRelease: true,
    tag: 'Heavy Cotton',
    productSlug: 'hoodie-01',
  },

  // 4. Cyberpunk Manga High-Density Graphic Tee
  {
    id: 'anime-tee-02',
    name: 'Mecha Unit Anime Back-Print T-Shirt',
    category: 'anime-prints',
    categoryLabel: 'Anime Prints',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
    priceUSD: 49,
    priceINR: 2699,
    weight: '270 GSM',
    composition: '100% Pure Cotton',
    fit: 'Relaxed Drop Shoulder',
    colors: [
      { name: 'Charcoal', hex: '#262626' },
      { name: 'Off-White', hex: '#F4F2EB' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isNewRelease: true,
    tag: 'Limited Print',
    productSlug: 'tee-03',
  },

  // 5. Thermal Zip Hoodie
  {
    id: 'hoodie-02',
    name: 'Heavy Thick Double-Zip Hoodie',
    category: 'hoodies',
    categoryLabel: 'Hoodies',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80',
    priceUSD: 125,
    priceINR: 6799,
    weight: '500 GSM',
    composition: '100% Warm Loopback Cotton',
    fit: 'Comfortable Boxy Fit',
    colors: [
      { name: 'Faded Black', hex: '#1C1C1E' },
      { name: 'Warm Taupe', hex: '#A89F91' },
    ],
    sizes: ['M', 'L', 'XL'],
    tag: 'Extra Warm',
    productSlug: 'hoodie-02',
  },

  // 6. Mineral Distressed Drop-Shoulder Tee
  {
    id: 'ds-tee-02',
    name: 'Acid Wash Vintage Drop-Shoulder T-Shirt',
    category: 'drop-shoulder',
    categoryLabel: 'Drop Shoulder',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80',
    priceUSD: 48,
    priceINR: 2599,
    weight: '280 GSM',
    composition: '100% Washed Soft Cotton',
    fit: 'Oversized Streetwear Fit',
    colors: [
      { name: 'Acid Black', hex: '#2A2A2E' },
      { name: 'Moss Green', hex: '#4A5348' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    tag: 'Acid Wash',
    productSlug: 'tee-04',
  },
];

/* =========================================================================
   COMING SOON (LAUNCHING NEXT - NOTIFY ME)
   ========================================================================= */
export const COMING_SOON_PRODUCTS: ComingSoonProduct[] = [
  {
    id: 'cs-01',
    name: 'Cyber Samurai Back-Print Oversized T-Shirt',
    category: 'anime-prints',
    categoryLabel: 'Anime Prints',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
    launchWindow: 'Friday, 8:00 PM',
    estimatedPriceUSD: 54,
    estimatedPriceINR: 2999,
    weight: '300 GSM Heavy Cotton',
    fit: 'Oversized Drop-Shoulder',
    description: 'Detailed colorful back graphic print on heavy 300 GSM cotton. Super soft feel that will not crack or peel in the wash.',
    printTechnique: 'High-Density Screenprint',
    previewTag: 'Only 150 Made',
  },
  {
    id: 'cs-02',
    name: 'Super-Heavy Warm Pullover Hoodie',
    category: 'hoodies',
    categoryLabel: 'Hoodies',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
    launchWindow: 'Coming Next Week',
    estimatedPriceUSD: 135,
    estimatedPriceINR: 7499,
    weight: '520 GSM Extra-Thick Fleece',
    fit: 'Roomy Relaxed Fit',
    description: 'Our thickest and warmest hoodie yet. Double stitched along all seams with extra strong cuffs and waist.',
    printTechnique: 'Clean Minimal Front Stitch',
    previewTag: 'Winter Special',
  },
  {
    id: 'cs-03',
    name: 'Sun-Faded Vintage Wash Drop-Shoulder T-Shirt',
    category: 'drop-shoulder',
    categoryLabel: 'Drop Shoulder',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80',
    launchWindow: 'Coming Soon',
    estimatedPriceUSD: 49,
    estimatedPriceINR: 2699,
    weight: '280 GSM Soft Washed Cotton',
    fit: 'Drop-Shoulder Fit',
    description: 'Washed with natural minerals to give it a worn-in vintage look and an ultra-soft feel right out of the box.',
    printTechnique: 'Vintage Mineral Wash',
    previewTag: 'Limited Edition',
  },
  {
    id: 'cs-04',
    name: 'Spirit Demon Sleeve-Print Graphic T-Shirt',
    category: 'anime-prints',
    categoryLabel: 'Anime Prints',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80',
    launchWindow: 'End of This Month',
    estimatedPriceUSD: 52,
    estimatedPriceINR: 2899,
    weight: '280 GSM Cotton',
    fit: 'Relaxed Drop-Shoulder',
    description: 'Clean anime art down the sleeve and along the back with subtle reflective details that catch the light.',
    printTechnique: 'Reflective Screenprint',
    previewTag: 'Early Access',
  },
];
