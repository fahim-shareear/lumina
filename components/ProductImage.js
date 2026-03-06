'use client';

import Image from 'next/image';

export default function ProductImage({ src, alt, className, width, height }) {
  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={(e) => {
        e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80';
      }}
    />
  );
}