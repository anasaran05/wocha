import { getAssetUrl } from '../storage';
import {
  STREETWEAR_PRODUCTS,
  GYM_WEAR_PRODUCTS,
  WINTER_WEAR_PRODUCTS,
  NORMAL_WEAR_PRODUCTS,
  ShowcaseProduct,
} from './showcase';

export type ProductCategory =
  | 'streetwear'
  | 'gym-wear'
  | 'winter-wear'
  | 'normal-wear'
  | 'hoodies'
  | 't-shirts'
  | 'puffers'
  | 'customizable';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface CustomizationOption {
  baseColor: string;
  text: string;
  placement: 'left-chest' | 'center-chest' | 'upper-back';
  font: 'grotesk' | 'serif' | 'mono';
  graphicPreset?: string;
}

export interface Product {
  id: string;
  slug?: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  compareAtPrice?: number;
  priceINR?: number;
  compareAtINR?: number;
  sizes: string[];
  colors: ProductColor[];
  images: string[];
  description: string;
  details: string[];
  composition: string;
  weight: string;
  isNew?: boolean;
  onSale?: boolean;
  customizable?: boolean;
  defaultCustomization?: CustomizationOption;
}

function mapShowcaseToProduct(p: ShowcaseProduct): Product {
  const images = p.images && p.images.length > 0
    ? p.images
    : (p.hoverImage ? [p.image, p.hoverImage] : [p.image]);

  return {
    id: p.id,
    slug: p.productSlug || p.id,
    name: p.name,
    category: p.collection as ProductCategory,
    categoryLabel: p.categoryLabel,
    price: p.priceUSD,
    compareAtPrice: p.compareAtUSD,
    priceINR: p.priceINR,
    compareAtINR: p.compareAtINR,
    sizes: p.sizes,
    colors: p.colors,
    images: images,
    description: `${p.fit} tailored with heavyweight craftsmanship. Made from ${p.composition}. Designed for long-lasting silhouette structure and all-day comfort.`,
    details: [
      p.composition,
      p.fit,
      p.tag ? `Edition: ${p.tag}` : 'WOCHA Core Piece',
      'High-density screenprint artwork with zero-crack finish',
      'Pre-shrunk fabric treatment to prevent washing shrinkage',
    ],
    composition: p.composition,
    weight: p.weight || '280 GSM Heavyweight',
    isNew: p.isNewRelease,
    onSale: Boolean(p.compareAtUSD && p.compareAtUSD > p.priceUSD),
  };
}

const SHOWCASE_MOCK_PRODUCTS: Product[] = [
  ...STREETWEAR_PRODUCTS.map(mapShowcaseToProduct),
  ...GYM_WEAR_PRODUCTS.map(mapShowcaseToProduct),
  ...WINTER_WEAR_PRODUCTS.map(mapShowcaseToProduct),
  ...NORMAL_WEAR_PRODUCTS.map(mapShowcaseToProduct),
];

export const MOCK_PRODUCTS: Product[] = [
  ...SHOWCASE_MOCK_PRODUCTS,
  // --- HOODIES ---
  {
    id: 'hoodie-01',
    name: '01 Heavyweight Boxy Hoodie',
    category: 'hoodies',
    categoryLabel: 'Hoodies',
    price: 185,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Pitch Black', hex: '#111111' },
      { name: 'Chalk Bone', hex: '#EBE9E1' },
      { name: 'Muted Clay', hex: '#B85C3E' },
    ],
    images: [
      getAssetUrl('hoodies', 'hoodie-01', 'front.jpg'),
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Constructed from 480 GSM organic loopback French terry. Cut in an architectural boxy silhouette with dropped shoulders, ribbed cuff framing, and zero exterior branding.',
    details: [
      '480 GSM heavy loopback French terry',
      'Preshrunk combed organic cotton',
      'Double-layer articulated hood without drawstrings',
      'Blind stitch finish along waist hem',
      'Made in Portugal',
    ],
    composition: '100% Organic Combed Cotton',
    weight: '480 GSM',
    isNew: true,
  },
  {
    id: 'hoodie-02',
    name: '02 Atelier Zip Pullover',
    category: 'hoodies',
    categoryLabel: 'Hoodies',
    price: 210,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Washed Charcoal', hex: '#262626' },
      { name: 'Raw Ecru', hex: '#ECE8DF' },
    ],
    images: [
      getAssetUrl('hoodies', 'hoodie-02', 'front.jpg'),
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Engineered half-zip silhouette featuring matte oxidized nickel hardware. Relaxed chest with a tapered lower band for balanced proportion over trousers.',
    details: [
      'Custom Swiss riri two-way zipper',
      '450 GSM diagonal loop terry',
      'Side seam concealed card pockets',
      'Garment dyed with low-impact pigment',
    ],
    composition: '100% Cotton Terry',
    weight: '450 GSM',
  },
  {
    id: 'hoodie-03',
    name: '03 Oversized Raw Edge Fleece',
    category: 'hoodies',
    categoryLabel: 'Hoodies',
    price: 165,
    compareAtPrice: 195,
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Oatmeal Heather', hex: '#D8D4C8' },
      { name: 'Jet Obsidian', hex: '#0D0D0D' },
    ],
    images: [
      getAssetUrl('hoodies', 'hoodie-03', 'front.jpg'),
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Subtle distressing along cuffs and hem creates a lived-in texture. Ultra-dense brushed interior provides exceptional insulation with a relaxed drape.',
    details: [
      'Brushed fleece interior',
      'Subtle raw edge cuff treatment',
      'Reinforced shoulder tape',
    ],
    composition: '80% Organic Cotton, 20% Recycled Polyester',
    weight: '420 GSM',
    onSale: true,
  },

  // --- T-SHIRTS ---
  {
    id: 'tshirt-01',
    name: '01 Heavyweight Boxy Tee',
    category: 't-shirts',
    categoryLabel: 'T-Shirts',
    price: 75,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Optical White', hex: '#FDFDFD' },
      { name: 'Soot Black', hex: '#141414' },
      { name: 'Muted Clay', hex: '#B85C3E' },
    ],
    images: [
      getAssetUrl('t-shirts', 'tshirt-01', 'front.jpg'),
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Our core everyday silhouette. Cut from 280 GSM dry-touch carded jersey that holds its sculptural structure through continuous wear.',
    details: [
      '280 GSM heavyweight carded jersey',
      '1.25" bound ribbed collar with high retention',
      'Drop shoulder with extended sleeve pitch',
      'Twin needle hem construction',
    ],
    composition: '100% Combed Cotton',
    weight: '280 GSM',
    isNew: true,
  },
  {
    id: 'tshirt-02',
    name: '02 Supima Relaxed Mockneck',
    category: 't-shirts',
    categoryLabel: 'T-Shirts',
    price: 90,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Concrete Grey', hex: '#8F908E' },
      { name: 'Pitch Black', hex: '#111111' },
    ],
    images: [
      getAssetUrl('t-shirts', 'tshirt-02', 'front.jpg'),
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Long-staple American Supima cotton crafted with a subtle 3cm mock collar. Silky hand-feel with structural drape for elevated layering.',
    details: [
      'Extra-long staple Supima cotton',
      '3cm ribbed mock collar',
      'Silicon wash finish for zero pilling',
    ],
    composition: '100% Supima Cotton',
    weight: '240 GSM',
  },
  {
    id: 'tshirt-03',
    name: '03 Raw Hem Studio Tee',
    category: 't-shirts',
    categoryLabel: 'T-Shirts',
    price: 65,
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Washed Chalk', hex: '#EBE7DF' },
      { name: 'Faded Black', hex: '#2A2A2A' },
    ],
    images: [
      getAssetUrl('t-shirts', 'tshirt-03', 'front.jpg'),
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Washed single jersey treated with an enzyme stone rinse for authentic vintage character. Finished with laser-cut raw sleeve and body edges.',
    details: [
      'Enzyme stone wash treatment',
      'Laser-cut raw edge hem',
      'Pre-shrunk jersey',
    ],
    composition: '100% Ring-spun Cotton',
    weight: '210 GSM',
  },

  // --- PUFFERS ---
  {
    id: 'puffer-01',
    name: '01 Baffle Quilted Down Puffer',
    category: 'puffers',
    categoryLabel: 'Puffers',
    price: 360,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Obsidian Matte', hex: '#121212' },
      { name: 'Olive Drab', hex: '#3B4136' },
      { name: 'Bone White', hex: '#E7E5DD' },
    ],
    images: [
      getAssetUrl('puffers', 'puffer-01', 'front.jpg'),
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Engineered for extreme thermal retention with 750 fill-power responsibly sourced down. Japanese micro-ripstop nylon shell with PFC-free DWR water repellent coating.',
    details: [
      '750 Fill-power RDS certified goose down',
      'Waterproof Japanese ripstop exterior',
      'Internal fleece-lined draft storm collar',
      'Two-way YKK Aquaguard zippers',
      'Concealed hem bungee tensioners',
    ],
    composition: 'Shell: 100% Recycled Nylon | Fill: 90% Down, 10% Feather',
    weight: '750 Fill Power',
    isNew: true,
  },
  {
    id: 'puffer-02',
    name: '02 Cropped Boxy Down Vest',
    category: 'puffers',
    categoryLabel: 'Puffers',
    price: 240,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Matte Black', hex: '#161616' },
      { name: 'Raw Sand', hex: '#C2B8A3' },
    ],
    images: [
      getAssetUrl('puffers', 'puffer-02', 'front.jpg'),
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Architectural cropped vest silhouette designed for modular outerwear layering. Clean baffle divisions and magnetic storm placket.',
    details: [
      '700 Fill-power white duck down',
      'Concealed FIDLOCK magnetic closures',
      'Dual deep welt hand-warmer pockets',
    ],
    composition: 'Shell: 100% Technical Taslan | Fill: 90/10 Down',
    weight: '700 Fill Power',
  },
  {
    id: 'puffer-03',
    name: '03 Technical Long Parka',
    category: 'puffers',
    categoryLabel: 'Puffers',
    price: 440,
    compareAtPrice: 510,
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Carbon Black', hex: '#181818' },
    ],
    images: [
      getAssetUrl('puffers', 'puffer-03', 'front.jpg'),
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Extended thigh-length coverage engineered for blizzard conditions. Triple-layer laminate membrane delivers complete wind-blocking and rain defense.',
    details: [
      '800 Fill-power European goose down',
      'Fully taped interior seams',
      'Internal backpack carry straps',
    ],
    composition: 'Shell: 3L GORE-TEX Infinium | Fill: 800 FP Goose Down',
    weight: '800 Fill Power',
    onSale: true,
  },

  // --- CUSTOMIZABLE T-SHIRTS ---
  {
    id: 'custom-01',
    name: 'Atelier Configurable Tee',
    category: 'customizable',
    categoryLabel: 'Custom Studio',
    price: 95,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Vintage White', hex: '#FAF8F5' },
      { name: 'Washed Black', hex: '#1E1E1E' },
      { name: 'Sand Dune', hex: '#D6CEBE' },
      { name: 'Muted Clay', hex: '#B85C3E' },
    ],
    images: [
      getAssetUrl('customizable', 'custom-01', 'front.jpg'),
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'Our signature bespoke garment. Premium 260 GSM organic jersey configured to order with custom typographic embossing or minimalist graphic motifs.',
    details: [
      'High-precision water-based screenprint / heat transfer',
      'Choice of 3 curated typographic systems',
      'Left pocket, center chest, or upper spine placement',
      'Customized and finished individually by hand',
    ],
    composition: '100% Organic Ring-Spun Cotton',
    weight: '260 GSM',
    customizable: true,
    defaultCustomization: {
      baseColor: '#FAF8F5',
      text: 'WOCHA STUDIO',
      placement: 'left-chest',
      font: 'grotesk',
      graphicPreset: 'ARCHIVE-01',
    },
    isNew: true,
  },
  {
    id: 'custom-02',
    name: 'Bespoke Typographic Oversize Tee',
    category: 'customizable',
    categoryLabel: 'Custom Studio',
    price: 110,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Chalk White', hex: '#FFFFFF' },
      { name: 'Raw Carbon', hex: '#1C1C1C' },
    ],
    images: [
      getAssetUrl('customizable', 'custom-02', 'front.jpg'),
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
    ],
    description: 'High-density 300 GSM silhouette with customized oversized rear typographic typography and personalized coordinates.',
    details: [
      'Heavy drape 300 GSM fabric weight',
      'Custom text print spanning upper back',
      'Personalized coordinate tag inside collar',
    ],
    composition: '100% Combed Heavy Cotton',
    weight: '300 GSM',
    customizable: true,
    defaultCustomization: {
      baseColor: '#FFFFFF',
      text: 'SYSTEM ARCHIVE // 2026',
      placement: 'upper-back',
      font: 'mono',
      graphicPreset: 'METRIC-FRAME',
    },
  },
];

export interface ProductFilter {
  category?: ProductCategory | 'all';
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'newest';
}

/**
 * Fetch all products with optional filters.
 * Thin abstraction seam: reads mock data now, ready to query Supabase.
 */
export async function getProducts(filter?: ProductFilter): Promise<Product[]> {
  try {
    const { getSupabaseClient } = await import('../supabase/client');
    const supabase = getSupabaseClient();

    let query = supabase
      .from('products')
      .select(`
        *,
        categories (slug, name),
        product_variants (*),
        product_images (*),
        customization_options (*)
      `)
      .eq('status', 'active');

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      let results: Product[] = data.map((p: any) => {
        const catSlug = (p.categories?.slug || 't-shirts') as ProductCategory;
        const images = (p.product_images || [])
          .sort((a: any, b: any) => a.sort_order - b.sort_order)
          .map((img: any) => getAssetUrl(catSlug, p.id, img.r2_key));

        const variants = p.product_variants || [];
        const sizes = Array.from(new Set(variants.map((v: any) => v.sku.split('-')[1] || 'M'))).filter(Boolean) as string[];

        return {
          id: p.id,
          name: p.name,
          category: catSlug,
          categoryLabel: p.categories?.name || 'Garment',
          price: Number(p.base_price),
          sizes: sizes.length > 0 ? sizes : ['S', 'M', 'L', 'XL'],
          colors: [
            { name: 'Pitch Black', hex: '#111111' },
            { name: 'Chalk Bone', hex: '#EBE9E1' },
          ],
          images: images.length > 0 ? images : [getAssetUrl(catSlug, p.id, 'front.jpg')],
          description: p.description || '',
          details: ['Constructed from certified organic cotton', 'Architectural relaxed silhouette', 'Pre-shrunk finish'],
          composition: '100% Organic Cotton',
          weight: '450 GSM',
          customizable: Boolean(p.is_customizable),
        };
      });

      if (filter?.category && filter.category !== 'all') {
        results = results.filter((p) => p.category === filter.category);
      }
      if (filter?.size) {
        results = results.filter((p) => p.sizes.includes(filter.size!));
      }
      if (filter?.minPrice !== undefined) {
        results = results.filter((p) => p.price >= filter.minPrice!);
      }
      if (filter?.maxPrice !== undefined) {
        results = results.filter((p) => p.price <= filter.maxPrice!);
      }
      if (filter?.sortBy) {
        switch (filter.sortBy) {
          case 'price-asc':
            results.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            results.sort((a, b) => b.price - a.price);
            break;
          case 'newest':
            results.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
            break;
        }
      }
      return results;
    }
  } catch {
    // Graceful fallback to mock data
  }

  let results = [...MOCK_PRODUCTS];

  if (filter?.category && filter.category !== 'all') {
    results = results.filter((p) => p.category === filter.category);
  }

  if (filter?.size) {
    results = results.filter((p) => p.sizes.includes(filter.size!));
  }

  if (filter?.minPrice !== undefined) {
    results = results.filter((p) => p.price >= filter.minPrice!);
  }

  if (filter?.maxPrice !== undefined) {
    results = results.filter((p) => p.price <= filter.maxPrice!);
  }

  if (filter?.sortBy) {
    switch (filter.sortBy) {
      case 'price-asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        results.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'featured':
      default:
        break;
    }
  }

  return results;
}

/**
 * Synchronously fetch a product by ID or Slug from local memory (instant 0ms lookup).
 */
export function getProductSync(id: string): Product | undefined {
  if (!id) return undefined;
  const cleanId = decodeURIComponent(id).trim().toLowerCase();

  return (
    MOCK_PRODUCTS.find(
      (p) =>
        p.id.toLowerCase() === cleanId ||
        p.slug?.toLowerCase() === cleanId ||
        p.id === id ||
        p.slug === id
    ) ||
    SHOWCASE_MOCK_PRODUCTS.find(
      (p) =>
        p.id.toLowerCase() === cleanId ||
        p.slug?.toLowerCase() === cleanId ||
        p.id === id ||
        p.slug === id
    )
  );
}

/**
 * Synchronously fetch related products from local memory (instant 0ms lookup).
 */
export function getRelatedProductsSync(category: string, currentId: string, currentSlug?: string): Product[] {
  return MOCK_PRODUCTS
    .filter(
      (p) =>
        p.id !== currentId &&
        (!currentSlug || p.slug !== currentSlug) &&
        (p.category === category || p.isNew)
    )
    .slice(0, 4);
}

/**
 * Fetch a single product by ID or Slug.
 */
export async function getProductById(id: string): Promise<Product | undefined> {
  const localMatch = getProductSync(id);
  if (localMatch) return localMatch;

  // Fallback to Supabase if not found in local mock data
  try {
    const { getSupabaseClient } = await import('../supabase/client');
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (slug, name),
        product_variants (*),
        product_images (*),
        customization_options (*)
      `)
      .or(`id.eq.${id},slug.eq.${id}`)
      .single();

    if (!error && data) {
      const catSlug = (data.categories?.slug || 't-shirts') as ProductCategory;
      const images = (data.product_images || [])
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((img: any) => getAssetUrl(catSlug, data.id, img.r2_key));

      return {
        id: data.id,
        slug: (data as any).slug || data.id,
        name: data.name,
        category: catSlug,
        categoryLabel: data.categories?.name || 'Garment',
        price: Number(data.base_price),
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Pitch Black', hex: '#111111' },
          { name: 'Chalk Bone', hex: '#EBE9E1' },
        ],
        images: images.length > 0 ? images : [getAssetUrl(catSlug, data.id, 'front.jpg')],
        description: data.description || '',
        details: ['Constructed from certified organic cotton', 'Heavyweight architectural drape', 'Pre-shrunk finish'],
        composition: '100% Organic Combed Cotton',
        weight: '450 GSM',
        customizable: Boolean(data.is_customizable),
      };
    }
  } catch {
    // Graceful fallback
  }

  return undefined;
}

/**
 * Fetch featured products for landing page.
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await getProducts();
  return all.slice(0, 4);
}

/**
 * Get category summary statistics.
 */
export function getCategories() {
  return [
    { id: 'all', label: 'All Items', count: MOCK_PRODUCTS.length },
    { id: 'streetwear', label: 'Streetwear', count: MOCK_PRODUCTS.filter((p) => p.category === 'streetwear').length },
    { id: 'gym-wear', label: 'Gym Wear', count: MOCK_PRODUCTS.filter((p) => p.category === 'gym-wear').length },
    { id: 'normal-wear', label: 'Normal Wear', count: MOCK_PRODUCTS.filter((p) => p.category === 'normal-wear').length },
    { id: 'hoodies', label: 'Hoodies', count: MOCK_PRODUCTS.filter((p) => p.category === 'hoodies').length },
    { id: 't-shirts', label: 'T-Shirts', count: MOCK_PRODUCTS.filter((p) => p.category === 't-shirts').length },
    { id: 'puffers', label: 'Jackets', count: MOCK_PRODUCTS.filter((p) => p.category === 'puffers').length },
  ];
}

