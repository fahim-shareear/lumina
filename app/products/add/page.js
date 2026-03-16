'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import styles from './page.module.css';

const CATEGORIES = ['Timepieces', 'Fragrance', 'Home', 'Textiles', 'Beauty', 'Stationery', 'Other'];
const PRIORITIES = ['Normal', 'High', 'Featured'];

export default function AddProductPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    price: '',
    category: 'Home',
    priority: 'Normal',
    imageUrl: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Redirect if not authenticated (client-side only)
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return <div className={styles.loading}>Checking authorisation...</div>;
  }

  const update = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.shortDescription.trim()) errs.shortDescription = 'Short description is required';
    else if (form.shortDescription.length > 160) errs.shortDescription = 'Max 160 characters';
    if (!form.fullDescription.trim()) errs.fullDescription = 'Full description is required';
    if (!form.price) errs.price = 'Price is required';
    else if (isNaN(form.price) || parseFloat(form.price) <= 0) errs.price = 'Enter a valid price';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const product = await res.json();
        toast.success('Product added successfully!');
        router.push(`/products/${product.id}`);
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to add product');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.orb} />
      <div className="container">
        <div className={styles.inner}>
          {/* Header */}
          <div className={styles.header}>
            <Link href="/products/manage" className={styles.back}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 8H1M6 3L1 8l5 5"/>
              </svg>
              Manage Products
            </Link>
            <span className="section-label">Protected · Sellers Only</span>
            <h1 className={styles.title}>Add New Product</h1>
            <p className={styles.subtitle}>List a new piece in the Lumina catalog.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            {/* Row 1 */}
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className="label">Product Title *</label>
                <input
                  className={`input ${errors.title ? styles.inputError : ''}`}
                  placeholder="e.g. Noir Obsidian Watch"
                  value={form.title}
                  onChange={update('title')}
                />
                {errors.title && <span className={styles.errorMsg}>{errors.title}</span>}
              </div>

              <div className={styles.field}>
                <label className="label">Price (USD) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={`input ${errors.price ? styles.inputError : ''}`}
                  placeholder="e.g. 1250"
                  value={form.price}
                  onChange={update('price')}
                />
                {errors.price && <span className={styles.errorMsg}>{errors.price}</span>}
              </div>
            </div>

            {/* Row 2 */}
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className="label">Category</label>
                <select
                  className="input"
                  value={form.category}
                  onChange={update('category')}
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className={styles.field}>
                <label className="label">Priority</label>
                <select
                  className="input"
                  value={form.priority}
                  onChange={update('priority')}
                >
                  {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>

            {/* Short description */}
            <div className={styles.field}>
              <label className="label">
                Short Description *
                <span className={styles.charCount}>{form.shortDescription.length}/160</span>
              </label>
              <input
                className={`input ${errors.shortDescription ? styles.inputError : ''}`}
                placeholder="One or two sentences about the product..."
                value={form.shortDescription}
                onChange={update('shortDescription')}
                maxLength={160}
              />
              {errors.shortDescription && <span className={styles.errorMsg}>{errors.shortDescription}</span>}
            </div>

            {/* Full description */}
            <div className={styles.field}>
              <label className="label">Full Description *</label>
              <textarea
                className={`input ${styles.textarea} ${errors.fullDescription ? styles.inputError : ''}`}
                placeholder="Detailed description, materials, provenance, dimensions..."
                value={form.fullDescription}
                onChange={update('fullDescription')}
                rows={5}
              />
              {errors.fullDescription && <span className={styles.errorMsg}>{errors.fullDescription}</span>}
            </div>

            {/* Image URL */}
            <div className={styles.field}>
              <label className="label">Image URL (optional)</label>
              <input
                type="url"
                className="input"
                placeholder="https://images.unsplash.com/..."
                value={form.imageUrl}
                onChange={update('imageUrl')}
              />
              <span className={styles.hint}>Leave blank to use a default image</span>
            </div>

            {/* Preview */}
            {form.imageUrl && (
              <div className={styles.imagePreview}>
                <span className={styles.previewLabel}>Image preview</span>
                <Image
                  src={form.imageUrl}
                  alt="Preview"
                  className={styles.previewImg}
                  width={200}
                  height={200}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}

            {/* Submit */}
            <div className={styles.actions}>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  <><span className={styles.spinnerSmall} /> Adding product...</>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 1v12M1 7h12"/>
                    </svg>
                    Add Product
                  </>
                )}
              </button>
              <Link href="/products" className="btn-secondary">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
