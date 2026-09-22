'use client';

import React from 'react';
import Link from 'next/link';
import { COMMUNITY_LOOKBOOK } from '@/lib/data/communityLookbook';

export function CommunityCollage() {
  return (
    <div className="w-full">
      {/* Seamless Gapless Multi-Column Masonry Wall - 0 gap, touching image to image */}
      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-0 [column-gap:_0px] [column-fill:_balance]">
        {COMMUNITY_LOOKBOOK.map((item) => (
          <div
            key={item.id}
            className="break-inside-avoid m-0 p-0 group relative overflow-hidden block bg-[#F0EFEB] cursor-pointer"
          >
            <Link
              href={`/product/${item.productId}`}
              className="block relative w-full m-0 p-0"
              title={item.title}
            >
              {/* Native Resolution Adaptive Image - Edge to edge, 0 gap, completely touching */}
              <img
                src={encodeURI(item.path)}
                alt={item.title}
                width={item.width}
                height={item.height}
                loading="lazy"
                decoding="async"
                className="w-full h-auto block m-0 p-0 object-contain object-center align-top transition-all duration-500 ease-out group-hover:scale-105 group-hover:opacity-90"
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
