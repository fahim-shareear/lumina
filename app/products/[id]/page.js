'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductImage from '@/components/ProductImage';
import { useCart } from '@/components/CartProvider';
import toast from 'react-hot-toast';
import styles from './page.module.css';

export default function ProductDetailPage({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setProduct(null);
        } else {
          setProduct(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setProduct(null);
        setLoading(false);
      });
  }, [params.id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast.success('Added to cart!');
    }
  };

  const priorityColors = {
    Featured: { bg: 'rgba(201,168,76,0.12)', color: '#c9a84c', border: 'rgba(201,168,76,0.3)' },
    High: { bg: 'rgba(76,175,125,0.1)', color: '#4caf7d', border: 'rgba(76,175,125,0.3)' },
    Normal: { bg: 'rgba(120,120,140,0.12)', color: '#8a8a9a', border: 'rgba(120,120,140,0.2)' },
  };

  const pc = priorityColors[product.priority] || priorityColors.Normal;

  if (loading) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.loading}>Loading...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.notFound}>
            <span className={styles.notFoundIcon}>✦</span>
            <h1>Product Not Found</h1>
            <p>The product you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/products" className="btn-primary">Browse Products</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Back button */}
        <Link href="/products" className={styles.back}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 8H1M6 3L1 8l5 5"/>
          </svg>
          Back to Catalog
        </Link>

        <div className={styles.layout}>
          {/* Image */}
          <div className={styles.imageCol}>
            <div className={styles.imageWrap}>
              <ProductImage
                src={product.imageUrl}
                alt={product.title}
                className={styles.image}
                width={600}
                height={400}
              />
            </div>
          </div>

          {/* Info */}
          <div className={styles.infoCol}>
            <div className={styles.tags}>
              <span className="tag">{product.category}</span>
              <span
                className={styles.priorityBadge}
                style={{ background: pc.bg, color: pc.color, border: `1px solid ${pc.border}` }}
              >
                {product.priority}
              </span>
            </div>

            <h1 className={styles.title}>{product.title}</h1>
            <p className={styles.shortDesc}>{product.shortDescription}</p>

            <div className={styles.priceRow}>
              <span className={styles.price}>${product.price?.toLocaleString()}</span>
              <span className={styles.priceLabel}>USD</span>
            </div>

            <button className={styles.addToCartBtn} onClick={handleAddToCart}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="9" cy="16" r="1"/>
                <circle cx="16" cy="16" r="1"/>
                <path d="M1 1h3l1.68 10.39a2 2 0 002 1.61h9.72a2 2 0 001.99-1.79l1.2-7.21H5"/>
              </svg>
              Add to Cart
            </button>

            <div className={styles.divider} />

            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Listed</span>
                <span className={styles.metaValue}>{product.createdAt}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Category</span>
                <span className={styles.metaValue}>{product.category}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Priority</span>
                <span className={styles.metaValue} style={{ color: pc.color }}>{product.priority}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Seller</span>
                <span className={styles.metaValue}>{product.addedBy}</span>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.fullDesc}>
              <h3 className={styles.descTitle}>About this piece</h3>
              <p className={styles.descText}>{product.fullDescription}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
