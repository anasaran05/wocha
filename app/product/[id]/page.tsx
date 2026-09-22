'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { getProductById, getProductSync, getRelatedProductsSync, Product, CustomizationOption } from '@/lib/data/products';
import { ConfiguratorPanel } from '@/components/product/ConfiguratorPanel';
import { ProductCard } from '@/components/shop/ProductCard';
import { useCartStore } from '@/lib/cart/store';
import { useWishlistStore } from '@/lib/wishlist/store';
import { useCurrencyStore } from '@/lib/currency/store';
import { Heart } from 'lucide-react';

export default function ProductDetailPage() {
  const routeParams = useParams();
  const rawId = routeParams?.id;
  const productId = (Array.isArray(rawId) ? rawId[0] : rawId) || '';

  // Instant synchronous local resolution (0ms - no DB delay)
  const initialProduct = productId ? getProductSync(productId) : null;

  const [product, setProduct] = useState<Product | null>(initialProduct || null);
  const [loading, setLoading] = useState<boolean>(!initialProduct);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>(() => initialProduct?.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(() => initialProduct?.colors[0]?.name || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [customization, setCustomization] = useState<CustomizationOption | undefined>(() =>
    initialProduct?.customizable ? initialProduct.defaultCustomization : undefined
  );
  const [relatedProducts, setRelatedProducts] = useState<Product[]>(() =>
    initialProduct ? getRelatedProductsSync(initialProduct.category, initialProduct.id, initialProduct.slug) : []
  );
  const [addedToast, setAddedToast] = useState(false);

  // Wishlist state
  const { formatPrice } = useCurrencyStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  const { addItem } = useCartStore();

  useEffect(() => {
    if (!productId) return;

    // Instant sync lookup on route switch
    const found = getProductSync(productId);
    if (found) {
      setProduct(found);
      setSelectedImage(0);
      setSelectedSize(found.sizes[0] || 'M');
      setSelectedColor(found.colors[0]?.name || '');
      if (found.customizable && found.defaultCustomization) {
        setCustomization(found.defaultCustomization);
      }
      setRelatedProducts(getRelatedProductsSync(found.category, found.id, found.slug));
      setLoading(false);
      return;
    }

    // Async fallback only if item wasn't in memory
    async function loadFallback() {
      setLoading(true);
      const item = await getProductById(productId);
      if (item) {
        setProduct(item);
        setSelectedImage(0);
        setSelectedSize(item.sizes[0] || 'M');
        setSelectedColor(item.colors[0]?.name || '');
        if (item.customizable && item.defaultCustomization) {
          setCustomization(item.defaultCustomization);
        }
        setRelatedProducts(getRelatedProductsSync(item.category, item.id, item.slug));
      }
      setLoading(false);
    }
    loadFallback();
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <span className="font-mono text-xs text-[#6B6B6B]">Loading Garment Specification...</span>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity,
      customization: product.customizable ? customization : undefined,
    });

    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono uppercase text-[#6B6B6B]">
        <Link href="/" className="hover:text-[#111111]">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[#111111]">Shop</Link>
        <span>/</span>
        <span className="text-[#111111]">{product.categoryLabel}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Gallery: 6 cols (Restrained luxury dimension) */}
        <div className="lg:col-span-6 space-y-4 max-w-[500px] mx-auto w-full">
          {/* Main Showcase Image */}
          <div className="relative aspect-[3/4] max-h-[540px] w-full bg-[#F4F4F2] hairline-border rounded-xl overflow-hidden p-3 sm:p-5 flex items-center justify-center">
            <Image
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              fill
              priority
              unoptimized
              sizes="(max-width: 1024px) 100vw, 500px"
              className="object-contain object-center p-2 sm:p-4"
            />
            {product.customizable && (
              <span className="absolute top-4 left-4 bg-[#111111] text-white text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded">
                Bespoke Atelier Garment
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-2 justify-center sm:justify-start">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-16 sm:w-20 aspect-square bg-[#F4F4F2] hairline-border rounded-lg overflow-hidden shrink-0 cursor-pointer transition-all p-1 ${
                    selectedImage === idx ? 'ring-2 ring-[#111111] border-[#111111]' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${idx}`}
                    fill
                    unoptimized
                    sizes="80px"
                    className="object-contain object-center p-1"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Selection: 6 cols */}
        <div className="lg:col-span-6 space-y-6">
          {/* Title & Price Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#6B6B6B] uppercase tracking-widest">
                {product.categoryLabel} &bull; {product.weight}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
              {product.name}
            </h1>
            <div className="pt-2 flex items-center gap-3 text-xl font-mono font-medium text-[#111111]">
              <span>
                {formatPrice(product.price, product.priceINR ? { INR: product.priceINR } : undefined)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-sm font-normal text-[#999999] line-through">
                  {formatPrice(product.compareAtPrice, product.compareAtINR ? { INR: product.compareAtINR } : undefined)}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
            {product.description}
          </p>

          {/* Color Selection */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-mono uppercase tracking-wider text-[#111111]">
                Color: <span className="font-semibold">{selectedColor}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColor(c.name)}
                  className={`p-1 hairline-border rounded-md transition-all cursor-pointer ${
                    selectedColor === c.name ? 'ring-1 ring-[#111111] bg-[#FAFAF8]' : 'hover:bg-[#FAFAF8]'
                  }`}
                >
                  <span
                    className="block w-6 h-6 rounded-full hairline-border"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-mono uppercase tracking-wider text-[#111111]">
                Size: <span className="font-semibold">{selectedSize}</span>
              </span>
              <span className="text-[11px] font-mono text-[#6B6B6B] uppercase">
                Fit: Architectural / Boxy
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={`py-2 text-xs font-mono text-center hairline-border rounded-md transition-colors cursor-pointer ${
                    selectedSize === s
                      ? 'bg-[#111111] text-white'
                      : 'bg-white text-[#111111] hover:bg-[#FAFAF8]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* CUSTOMIZABLE CONFIGURATOR SECTION (IF CUSTOMIZABLE) */}
          {product.customizable && (
            <div className="pt-2">
              <ConfiguratorPanel
                initialConfig={customization}
                onChange={setCustomization}
              />
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center hairline-border rounded-lg bg-white h-11 px-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 text-sm text-[#111111] hover:bg-[#FAFAF8] rounded transition-colors"
                >
                  -
                </button>
                <span className="px-3 text-xs font-mono text-[#111111] font-medium">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2 text-sm text-[#111111] hover:bg-[#FAFAF8] rounded transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add to Bag CTA */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 wocha-btn rounded-lg h-11 text-xs uppercase tracking-wider text-white"
              >
                {product.customizable ? 'Add Bespoke Garment to Bag' : 'Add to Bag'} &bull; {formatPrice(product.price * quantity, product.priceINR ? { INR: product.priceINR * quantity } : undefined)}
              </button>

              {/* Wishlist toggle */}
              <button
                type="button"
                onClick={() => {
                  if (isInWishlist(product.id)) {
                    removeFromWishlist(product.id);
                  } else {
                    addToWishlist({
                      productId: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.images[0],
                      category: product.categoryLabel,
                    });
                  }
                }}
                className={`h-11 w-11 flex items-center justify-center hairline-border rounded-lg transition-colors cursor-pointer ${
                  isInWishlist(product.id) ? 'bg-[#111111] text-white' : 'bg-white text-[#111111] hover:bg-[#FAFAF8]'
                }`}
                aria-label="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current text-white' : ''}`} />
              </button>
            </div>

            {/* 3D Mannequin Studio Link */}
            <Link
              href="/custom-studio"
              className="w-full flex items-center justify-center gap-2 hairline-border rounded-lg h-10 text-[11px] font-mono uppercase tracking-wider text-[#111111] bg-[#FAFAF8] hover:bg-white hover:border-[#111111] transition-all"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              View &bull; Fit on 3D Editorial Mannequin &rarr;
            </Link>

            {/* Quick added toast feedback */}
            {addedToast && (
              <div className="p-2.5 bg-white hairline-border rounded-lg text-center text-xs font-mono text-[#111111] transition-all animate-in fade-in">
                &check; Added to your bag. Opening cart drawer...
              </div>
            )}
          </div>

          {/* Material & Construction Specs Accordion / List */}
          <div className="hairline-top pt-6 space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-[#111111] uppercase tracking-wider mb-2">
                Construction & Technical Details
              </h4>
              <ul className="space-y-1.5 text-xs text-[#6B6B6B]">
                {product.details.map((detail, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-[#111111] rounded-full" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 font-mono text-[11px] text-[#6B6B6B] space-y-1 hairline-top">
              <div>Composition: <span className="text-[#111111]">{product.composition}</span></div>
              <div>Fabric Weight: <span className="text-[#111111]">{product.weight}</span></div>
              <div>Origin: <span className="text-[#111111]">Milled in Portugal</span></div>
            </div>
          </div>
        </div>
      </div>



      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="hairline-top pt-16 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[11px] font-mono text-[#6B6B6B] uppercase tracking-widest block">
                Complementary Pieces
              </span>
              <h2 className="text-xl font-bold tracking-tight text-[#111111]">
                Related Silhouettes
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-mono uppercase text-[#111111] underline underline-offset-4"
            >
              Full Catalog
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
