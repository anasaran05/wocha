/**
 * WOCHA — Cloudflare R2 Asset Storage & CDN URL Resolver
 * Connects to Cloudflare R2 asset storage through high-speed CDN.
 */

const R2_PUBLIC_DOMAIN = process.env.NEXT_PUBLIC_R2_DOMAIN || 'https://cdn.wocha.com';

const PLACEHOLDER_MAP: Record<string, string> = {
  'hoodie-01': 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80',
  'hoodie-02': 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1200&q=80',
  'hoodie-03': 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=80',
  'tshirt-01': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
  'tshirt-02': 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=80',
  'tshirt-03': 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80',
  'puffer-01': 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80',
  'puffer-02': 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1200&q=80',
  'puffer-03': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
  'custom-01': 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1200&q=80',
  'custom-02': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
};

/**
 * Generate standard R2 storage key paths according to system architecture
 */
export function createR2Key(
  type: 'product' | 'banner' | 'avatar' | 'temp',
  params: {
    categorySlug?: string;
    productId?: string;
    variantId?: string;
    bannerId?: string;
    userId?: string;
    uploadId?: string;
    filename: string;
  }
): string {
  const sanitized = params.filename.replace(/[^a-zA-Z0-9.-]/g, '_');

  switch (type) {
    case 'product':
      if (params.variantId) {
        return `products/${params.categorySlug || 'general'}/${params.productId}/${params.variantId}/${sanitized}`;
      }
      return `products/${params.categorySlug || 'general'}/${params.productId}/${sanitized}`;
    case 'banner':
      return `banners/${params.bannerId || 'general'}/${sanitized}`;
    case 'avatar':
      return `users/${params.userId || 'guest'}/avatar/${sanitized}`;
    case 'temp':
    default:
      return `admin-uploads/tmp/${params.uploadId || Date.now()}/${sanitized}`;
  }
}

/**
 * Resolves an asset storage key to its public CDN URL.
 * Falls back to high-resolution studio garment photography if key is missing or unresolved.
 */
export function getAssetUrl(
  categoryOrKey: string,
  productId?: string,
  filename?: string
): string {
  // If a full R2 key was provided directly
  if (!productId && !filename) {
    if (categoryOrKey.startsWith('http://') || categoryOrKey.startsWith('https://')) {
      return categoryOrKey;
    }
    return `${R2_PUBLIC_DOMAIN}/${categoryOrKey.replace(/^\/+/, '')}`;
  }

  // If R2 credentials and custom domain are configured for live production
  if (process.env.NEXT_PUBLIC_R2_DOMAIN && !process.env.NEXT_PUBLIC_R2_DOMAIN.includes('cdn.wocha.com')) {
    const key = createR2Key('product', {
      categorySlug: categoryOrKey,
      productId,
      filename: filename || 'front.jpg',
    });
    return `${R2_PUBLIC_DOMAIN}/${key}`;
  }

  // Graceful fallback to verified aesthetic fashion imagery
  if (productId && PLACEHOLDER_MAP[productId]) {
    return PLACEHOLDER_MAP[productId];
  }

  return 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80';
}

/**
 * Requests a short-lived presigned upload URL from the server API
 */
export async function requestPresignedUpload(
  key: string,
  contentType: string
): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
  const response = await fetch('/api/storage/presigned-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, contentType }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Upload authorization failed' }));
    throw new Error(err.error || 'Failed to request upload signature');
  }

  return response.json();
}
