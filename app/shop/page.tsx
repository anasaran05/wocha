'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/shop/ProductCard';
import { FilterBar } from '@/components/shop/FilterBar';
import { getProducts, ProductCategory, Product } from '@/lib/data/products';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get('category') as ProductCategory) || 'all';

  const [category, setCategory] = useState<ProductCategory | 'all'>(initialCategory);
  const [size, setSize] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync category state with URL if changed
  useEffect(() => {
    const cat = searchParams.get('category') as ProductCategory;
    if (cat) {
      setCategory(cat);
    }
    const filter = searchParams.get('filter');
    if (filter === 'new') {
      setSortBy('newest');
    }
  }, [searchParams]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getProducts({
        category,
        size: size || undefined,
        sortBy,
      });
      setProducts(data);
      setLoading(false);
    }
    load();
  }, [category, size, sortBy]);

  const resetFilters = () => {
    setCategory('all');
    setSize('');
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
       
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111]">
          {searchParams.get('filter') === 'new'
            ? 'New In'
            : category === 'streetwear'
            ? 'Streetwear Collection'
            : category === 'gym-wear'
            ? 'Gym Wear Collection'
            : category === 'designer-choice'
            ? "Designer's Choice"
            : 'All Collections'}
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-xl">
          {searchParams.get('filter') === 'new'
            ? 'The latest releases, freshly dropped silhouettes, and new arrivals.'
            : category === 'streetwear'
            ? 'Oversized cuts, heavyweight cotton, and clean streetwear essentials.'
            : category === 'gym-wear'
            ? 'Breathable stretch fabrics, athletic fits, and comfortable training apparel.'
            : category === 'designer-choice'
            ? 'Curated avant-garde cuts, premium bespoke silhouettes, and runway essentials.'
            : 'Explore our complete collection of streetwear, gym wear, and designer silhouettes.'}
        </p>
      </div>

      {/* Filter and Sort Bar */}
      <FilterBar
        selectedCategory={category}
        onSelectCategory={setCategory}
        selectedSize={size}
        onSelectSize={setSize}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalCount={products.length}
      />

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-12">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-[3/4] bg-[#FAFAF8] hairline-border animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center bg-white hairline-border space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-[#6B6B6B] block">
            No products found
          </span>
          <p className="text-sm text-[#111111] max-w-sm mx-auto">
            Try resetting your filters to see all available items.
          </p>
          <button
            onClick={resetFilters}
            className="wocha-btn px-4 py-2 text-xs text-white"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 font-mono text-xs">Loading Catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
