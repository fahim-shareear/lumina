'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';

const CATEGORIES = ['All', 'Timepieces', 'Fragrance', 'Home', 'Textiles', 'Beauty', 'Stationery'];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.header}>
        <div className="container">
          <span className="section-label">Catalog</span>
          <h1 className={styles.title}>All Products</h1>
          <p className={styles.subtitle}>
            Browse our curated collection of extraordinary objects from artisans worldwide.
          </p>
        </div>
      </div>

      <div className="container">
        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.searchWrap}>
            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="6.5" cy="6.5" r="4.5"/>
              <path d="M10 10l3.5 3.5"/>
            </svg>
            <input
              className={`input ${styles.searchInput}`}
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className={styles.categories}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`${styles.catBtn} ${category === cat ? styles.catActive : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results info */}
        <div className={styles.resultsInfo}>
          <span>{loading ? 'Loading...' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}</span>
          {(search || category !== 'All') && (
            <button
              className={styles.clearBtn}
              onClick={() => { setSearch(''); setCategory('All'); }}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className={styles.grid}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={styles.skeletonCard}>
                <div className={`skeleton ${styles.skeletonImg}`} />
                <div className={styles.skeletonBody}>
                  <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 18, width: '80%', marginBottom: 6 }} />
                  <div className="skeleton" style={{ height: 14, width: '60%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>◈</span>
            <p>No products found</p>
            <span>Try adjusting your search or filters</span>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
