'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import styles from './page.module.css';

const priorityStyles = {
  Featured: { color: '#c9a84c', bg: 'rgba(201,168,76,0.1)' },
  High: { color: '#4caf7d', bg: 'rgba(76,175,125,0.1)' },
  Normal: { color: '#8a8a9a', bg: 'rgba(120,120,140,0.1)' },
};

export default function ManageProductsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      fetch('/api/products')
        .then((r) => r.json())
        .then((data) => { setProducts(data); setLoading(false); });
    }
  }, [user]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        toast.success('Product deleted');
      } else {
        toast.error('Failed to delete');
      }
    } catch {
      toast.error('Error deleting product');
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <span className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.orb} />
      <div className={styles.orb} />
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <div>
            <span className="section-label">Protected · Sellers Only</span>
            <h1 className={styles.title}>Manage Products</h1>
            <p className={styles.subtitle}>{products.length} product{products.length !== 1 ? 's' : ''} in catalog</p>
          </div>
          <Link href="/products/add" className="btn-primary">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 1v12M1 7h12"/>
            </svg>
            Add Product
          </Link>
        </div>

        {/* Table */}
        {products.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>◈</span>
            <p>No products yet</p>
            <Link href="/products/add" className="btn-primary" style={{ marginTop: 16 }}>Add your first product</Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Priority</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const ps = priorityStyles[p.priority] || priorityStyles.Normal;
                    return (
                      <tr key={p.id}>
                        <td>
                          <div className={styles.productCell}>
                            <Image
                              src={p.imageUrl}
                              alt={p.title}
                              className={styles.thumb}
                              width={40}
                              height={40}
                              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'; }}
                            />
                            <div>
                              <p className={styles.productTitle}>{p.title}</p>
                              <p className={styles.productDesc}>{p.shortDescription}</p>
                            </div>
                          </div>
                        </td>
                        <td><span className="tag">{p.category}</span></td>
                        <td><span className={styles.price}>${p.price?.toLocaleString()}</span></td>
                        <td>
                          <span className={styles.priority} style={{ color: ps.color, background: ps.bg }}>
                            {p.priority}
                          </span>
                        </td>
                        <td><span className={styles.date}>{p.createdAt}</span></td>
                        <td>
                          <div className={styles.actions}>
                            <Link href={`/products/${p.id}`} className={styles.actionBtn}>
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="7" cy="7" r="2.5"/>
                                <path d="M1 7c1.5-3.5 8.5-3.5 12 0-1.5 3.5-8.5 3.5-12 0z"/>
                              </svg>
                              View
                            </Link>
                            <button
                              className={`${styles.actionBtn} ${styles.deleteBtn}`}
                              onClick={() => setConfirmDelete(p)}
                              disabled={deletingId === p.id}
                            >
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M1 3h12M5 3V1h4v2M5.5 6v5M8.5 6v5M2.5 3l.5 9h8l.5-9"/>
                              </svg>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className={styles.mobileCards}>
              {products.map((p) => {
                const ps = priorityStyles[p.priority] || priorityStyles.Normal;
                return (
                  <div key={p.id} className={styles.mobileCard}>
                    <div className={styles.mobileCardTop}>
                      <Image
                        src={p.imageUrl}
                        alt={p.title}
                        className={styles.mobileThumb}
                        width={60}
                        height={60}
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'; }}
                      />
                      <div className={styles.mobileInfo}>
                        <p className={styles.productTitle}>{p.title}</p>
                        <div className={styles.mobileMeta}>
                          <span className="tag">{p.category}</span>
                          <span className={styles.priority} style={{ color: ps.color, background: ps.bg }}>{p.priority}</span>
                        </div>
                        <p className={styles.price}>${p.price?.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className={styles.mobileActions}>
                      <Link href={`/products/${p.id}`} className={styles.actionBtn}>View</Link>
                      <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => setConfirmDelete(p)}>Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Confirm delete modal */}
      {confirmDelete && (
        <div className={styles.modalOverlay} onClick={() => setConfirmDelete(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 6h18M8 6V4h8v2M10 11v6M14 11v6M4 6l1 14h14l1-14"/>
              </svg>
            </div>
            <h3 className={styles.modalTitle}>Delete product?</h3>
            <p className={styles.modalText}>
              <strong>{confirmDelete.title}</strong> will be permanently removed from the catalog.
            </p>
            <div className={styles.modalActions}>
              <button className="btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button
                className={styles.deleteConfirmBtn}
                onClick={() => handleDelete(confirmDelete.id)}
                disabled={deletingId === confirmDelete.id}
              >
                {deletingId === confirmDelete.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
