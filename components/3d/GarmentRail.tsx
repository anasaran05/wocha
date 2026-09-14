'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GarmentSelection } from './MannequinScene';

interface GarmentOption {
  id: GarmentSelection;
  name: string;
  category: string;
  spec: string;
  price: number;
  productId: string;
  image: string;
}

const GARMENT_OPTIONS: GarmentOption[] = [
  {
    id: 'hoodie',
    name: '01 Heavyweight Boxy Hoodie',
    category: 'Hoodie',
    spec: '480 GSM French Terry',
    price: 185,
    productId: 'hoodie-01',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'tshirt',
    name: '01 Heavyweight Boxy Tee',
    category: 'T-Shirt',
    spec: '280 GSM Carded Jersey',
    price: 75,
    productId: 'tshirt-01',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'puffer',
    name: '01 Baffle Quilted Puffer',
    category: 'Outerwear',
    spec: '750 FP Down / Ripstop',
    price: 360,
    productId: 'puffer-01',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=400&q=80',
  },
];

interface GarmentRailProps {
  activeGarment: GarmentSelection;
  onSelectGarment: (garment: GarmentSelection) => void;
}

export function GarmentRail({ activeGarment, onSelectGarment }: GarmentRailProps) {
  const activeOption = GARMENT_OPTIONS.find((g) => g.id === activeGarment) || GARMENT_OPTIONS[0];

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Garment selection rail items */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {GARMENT_OPTIONS.map((garment) => {
          const isActive = activeGarment === garment.id;
          return (
            <button
              key={garment.id}
              onClick={() => onSelectGarment(garment.id)}
              className={`text-left p-2.5 sm:p-3 rounded-xl transition-all cursor-pointer relative ${
                isActive
                  ? 'bg-white hairline-border ring-1 ring-[#111111]'
                  : 'bg-[#FAFAF8] hairline-border hover:bg-white hover:border-[#111111]'
              }`}
            >
              {/* Active pip */}
              {isActive && (
                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#111111]" />
              )}

              <div className="relative aspect-square w-full mb-2 bg-[#F0EFEA] rounded-lg overflow-hidden">
                <Image
                  src={garment.image}
                  alt={garment.name}
                  fill
                  sizes="(max-width: 768px) 33vw, 150px"
                  className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>

              <span className="block text-[10px] font-mono text-[#6B6B6B] uppercase tracking-wider mb-0.5">
                {garment.category}
              </span>
              <h4 className="text-xs font-medium text-[#111111] leading-snug line-clamp-1 mb-1">
                {garment.name}
              </h4>
              <span className="block text-xs font-mono text-[#111111]">
                ${garment.price}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active silhouette quick info banner with link to PDP */}
      <div className="bg-white p-3.5 hairline-border rounded-xl flex items-center justify-between mt-1">
        <div>
          <span className="text-[10px] font-mono text-[#6B6B6B] uppercase tracking-widest block">
            Active Mannequin Rig:
          </span>
          <p className="text-xs font-medium text-[#111111] mt-0.5">
            {activeOption.name} <span className="text-[#6B6B6B] font-mono font-normal">({activeOption.spec})</span>
          </p>
        </div>

        <Link
          href={`/product/${activeOption.productId}`}
          className="wocha-btn rounded-lg px-3.5 py-1.5 text-xs text-white"
        >
          View Specs
        </Link>
      </div>
    </div>
  );
}
