'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getCategoryBySlug, CategoryTreeItem } from '@/lib/data/categories';
import { getProducts, Product } from '@/lib/data/products';
import { ProductCard } from '@/components/shop/ProductCard';
import { ChevronRight, Sparkles } from 'lucide-react';

export default function SubCategoryPage() {
  const routeParams = useParams();
  const rawCat = routeParams?.categorySlug;
  const rawSub = routeParams?.subCategorySlug;
  const categorySlug = (Array.isArray(rawCat) ? rawCat[0] : rawCat) || '';
  const subCategorySlug = (Array.isArray(rawSub) ? rawSub[0] : rawSub) || '';

  const [parentCat, setParentCat] = useState<CategoryTreeItem | null>(null);
  const [subCat, setSubCat] = useState<CategoryTreeItem | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const parent = await getCategoryBySlug(categorySlug);
      const sub = await getCategoryBySlug(subCategorySlug);
      setParentCat(parent);
      setSubCat(sub);

      const items = await getProducts({
        category: subCategorySlug as any,
      });
      setProducts(items);
      setLoading(false);
    }
    load();
  }, [categorySlug, subCategorySlug]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-[#6B6B6B]">
        <Link href="/" className="hover:text-[#111111]">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/shop" className="hover:text-[#111111]">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href={`/shop/${categorySlug}`} className="hover:text-[#111111]">
          {parentCat?.name || categorySlug}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#111111] font-semibold">{subCat?.name || subCategorySlug}</span>
      </nav>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#111111]" />
          <span className="text-xs font-mono uppercase tracking-widest text-[#6B6B6B]">
            Adaptive Sub-Silhouette
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111]">
          {subCat?.name || subCategorySlug.toUpperCase()}
        </h1>
        {subCat?.description && (
          <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-xl">
            {subCat.description}
          </p>
        )}
      </div>

      {/* Products */}
      {loading ? (
        <div className="p-20 text-center font-mono text-xs text-[#6B6B6B]">
          Loading adaptive silhouettes...
        </div>
      ) : products.length === 0 ? (
        <div className="p-16 text-center bg-white hairline-border rounded-xl space-y-3">
          <p className="text-xs font-mono text-[#6B6B6B]">No garments found in this subcategory.</p>
          <Link href={`/shop/${categorySlug}`} className="text-xs font-mono underline text-[#111111]">
            Return to {parentCat?.name || 'Category'}
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
