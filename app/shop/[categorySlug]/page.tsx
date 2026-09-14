'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getCategoryBySlug, CategoryTreeItem } from '@/lib/data/categories';
import { getProducts, Product } from '@/lib/data/products';
import { ProductCard } from '@/components/shop/ProductCard';
import { SlidersHorizontal, ChevronRight } from 'lucide-react';

export default function CategoryPage() {
  const routeParams = useParams();
  const rawSlug = routeParams?.categorySlug;
  const categorySlug = (Array.isArray(rawSlug) ? rawSlug[0] : rawSlug) || '';

  const [category, setCategory] = useState<CategoryTreeItem | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const cat = await getCategoryBySlug(categorySlug);
      setCategory(cat);

      const items = await getProducts({
        category: categorySlug as any,
        size: selectedSize || undefined,
      });
      setProducts(items);
      setLoading(false);
    }
    load();
  }, [categorySlug, selectedSize]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-[#6B6B6B]">
        <Link href="/" className="hover:text-[#111111]">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/shop" className="hover:text-[#111111]">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#111111] font-semibold">{category?.name || categorySlug}</span>
      </nav>

      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-[#6B6B6B] block">
          Curated Category
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111]">
          {category?.name || categorySlug.toUpperCase()}
        </h1>
        {category?.description && (
          <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-xl">
            {category.description}
          </p>
        )}
      </div>

      {/* Subcategories (if any) */}
      {category?.children && category.children.length > 0 && (
        <div className="flex items-center gap-3 pt-2">
          <span className="text-xs font-mono uppercase text-[#6B6B6B]">Sub-silhouettes:</span>
          <div className="flex flex-wrap gap-2">
            {category.children.map((sub) => (
              <Link
                key={sub.slug}
                href={`/shop/${categorySlug}/${sub.slug}`}
                className="text-xs font-mono px-3 py-1.5 rounded-full hairline-border bg-white hover:bg-[#FAFAF8] text-[#111111] transition-colors"
              >
                {sub.name} &rarr;
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Adaptive Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white hairline-border rounded-xl">
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="w-4 h-4 text-[#6B6B6B]" />
          <span className="text-xs font-mono uppercase text-[#6B6B6B]">Filter by Adaptive Size:</span>
          <div className="flex items-center gap-1.5">
            {['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
              const isSelected = sz === 'All' ? !selectedSize : selectedSize === sz;
              return (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz === 'All' ? '' : sz)}
                  className={`text-xs font-mono px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#111111] text-white'
                      : 'bg-[#FAFAF8] text-[#6B6B6B] hover:text-[#111111]'
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>
        <span className="text-xs font-mono text-[#6B6B6B]">
          {products.length} Garments Index
        </span>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="p-20 text-center font-mono text-xs text-[#6B6B6B]">
          Loading silhouettes...
        </div>
      ) : products.length === 0 ? (
        <div className="p-16 text-center bg-white hairline-border rounded-xl space-y-3">
          <p className="text-xs font-mono text-[#6B6B6B]">No garments found in this category.</p>
          <Link href="/shop" className="text-xs font-mono underline text-[#111111]">
            View all collections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
}
