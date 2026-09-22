import { getAssetUrl } from '../storage';
import {
  STREETWEAR_PRODUCTS,
  GYM_WEAR_PRODUCTS,
  DESIGNER_CHOICE_PRODUCTS,
  WINTER_WEAR_PRODUCTS,
  ShowcaseProduct,
} from './showcase';

export type ProductCategory =
  | 'streetwear'
  | 'gym-wear'
  | 'designer-choice'
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
  ...DESIGNER_CHOICE_PRODUCTS.map(mapShowcaseToProduct),
];

export const MOCK_PRODUCTS: Product[] = [
  ...SHOWCASE_MOCK_PRODUCTS,
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
    { id: 'designer-choice', label: "Designer's Choice", count: MOCK_PRODUCTS.filter((p) => p.category === 'designer-choice').length },
  ];
}

