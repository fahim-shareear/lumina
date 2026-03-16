'use client';

import Image from 'next/image';

export default function ProductImage({ src, alt, className, width, height }) {
  // Use a reliable default placeholder if src is empty or missing
  const imageSrc = src && src.trim() !== '' 
    ? src 
    : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80';

  return (
    <Image
      src={imageSrc}
      alt={alt || 'Product image'}
      className={className}
      width={width}
      height={height}
      onError={(e) => {
        // Fallback for broken URLs
        e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80';
      }}
    />
  );
}