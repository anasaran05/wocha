'use client';

import React from 'react';
import { ProductCategory } from '@/lib/data/products';

interface FilterBarProps {
  selectedCategory: ProductCategory | 'all';
  onSelectCategory: (cat: ProductCategory | 'all') => void;
  selectedSize: string;
  onSelectSize: (size: string) => void;
  sortBy: string;
  onSortChange: (sort: 'featured' | 'price-asc' | 'price-desc' | 'newest') => void;
  totalCount: number;
}

const CATEGORIES: { id: ProductCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Items' },
  { id: 'streetwear', label: 'Streetwear' },
  { id: 'gym-wear', label: 'Gym Wear' },
  { id: 'normal-wear', label: 'Normal Wear' },
  { id: 'hoodies', label: 'Hoodies' },
  { id: 't-shirts', label: 'T-Shirts' },
  { id: 'puffers', label: 'Jackets' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export function FilterBar({
  selectedCategory,
  onSelectCategory,
  selectedSize,
  onSelectSize,
  sortBy,
  onSortChange,
  totalCount,
}: FilterBarProps) {
  return (
    <div className="bg-[#FFFFFF] hairline-border rounded-xl p-4 mb-8 space-y-4">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 hairline-bottom pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider font-mono rounded-md transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#0A0A0A] text-white'
                    : 'bg-[#FAFAF8] text-[#111111] hairline-border hover:bg-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Total products badge */}
        <span className="text-xs font-mono text-[#6B6B6B]">
          [{totalCount} {totalCount === 1 ? 'Garment' : 'Garments'}]
        </span>
      </div>

      {/* Second Row: Sizes & Sort Dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Size Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-mono text-[#6B6B6B] uppercase tracking-wider mr-1">
            Size:
          </span>
          <button
            onClick={() => onSelectSize('')}
            className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors cursor-pointer ${
              selectedSize === ''
                ? 'bg-[#111111] text-white'
                : 'bg-white hairline-border text-[#6B6B6B] hover:text-[#111111]'
            }`}
          >
            All
          </button>
          {SIZES.map((size) => {
            const isSelected = selectedSize === size;
            return (
              <button
                key={size}
                onClick={() => onSelectSize(isSelected ? '' : size)}
                className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#111111] text-white'
                    : 'bg-white hairline-border text-[#6B6B6B] hover:text-[#111111]'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#6B6B6B] uppercase tracking-wider">
            Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="bg-white hairline-border rounded-md px-3 py-1 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111] cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest Releases</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}
