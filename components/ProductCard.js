'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/CartProvider';
import toast from 'react-hot-toast';
import styles from './ProductCard.module.css';

const categoryColors = {
  Timepieces: '#c9a84c',
  Fragrance: '#a084c9',
  Home: '#84c9a0',
  Textiles: '#c98484',
  Beauty: '#c984b8',
  Stationery: '#84afc9',
  default: '#888',
};

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const color = categoryColors[product.category] || categoryColors.default;

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation if clicked on link
    addToCart(product);
    toast.success('Added to cart!');
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        <Image
          src={product.imageUrl}
          alt={product.title}
          className={styles.image}
          width={300}
          height={200}
          loading="lazy"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'; }}
        />
        <div className={styles.categoryBadge} style={{ '--cat-color': color }}>
          {product.category}
        </div>
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.description}>{product.shortDescription}</p>
        <div className={styles.footer}>
          <span className={styles.price}>${product.price?.toLocaleString()}</span>
          <div className={styles.actions}>
            <Link href={`/products/${product.id}`} className={styles.detailsBtn}>
              Details
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 7h12M8 3l4 4-4 4"/>
              </svg>
            </Link>
            <button className={styles.addToCartBtn} onClick={handleAddToCart}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="8" cy="14" r="1"/>
                <circle cx="14" cy="14" r="1"/>
                <path d="M1 1h3l1.68 10.39a2 2 0 002 1.61h9.72a2 2 0 001.99-1.79l1.2-7.21H5"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
