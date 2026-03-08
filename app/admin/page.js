'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProducts, addProduct, deleteProduct } from '@/lib/products';
import toast from 'react-hot-toast';
import styles from './page.module.css';

export default function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (!loading && !isAdmin) {
      router.push('/dashboard');
      return;
    }

    // Load products
    const allProducts = getProducts();
    setProducts(allProducts);
    setStats({
      totalProducts: allProducts.length,
      totalRevenue: 0, // Would be calculated from actual orders
      totalOrders: 0, // Would be calculated from actual orders
    });
  }, [user, loading, isAdmin, router]);

  const handleDeleteProduct = (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const success = deleteProduct(productId);
      if (success) {
        setProducts(products.filter(p => p.id !== productId));
        toast.success('Product deleted successfully');
      } else {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleAddProduct = (productData) => {
    try {
      const newProduct = addProduct(productData);
      setProducts([...products, newProduct]);
      setShowAddForm(false);
      toast.success('Product added successfully');
    } catch (error) {
      toast.error('Failed to add product');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!user || !isAdmin) {
    return null; // Will redirect
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <p className={styles.subtitle}>Manage your marketplace</p>
        </div>

        {/* Stats Cards */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.totalProducts}</div>
            <div className={styles.statLabel}>Total Products</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>${stats.totalRevenue.toLocaleString()}</div>
            <div className={styles.statLabel}>Total Revenue</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.totalOrders}</div>
            <div className={styles.statLabel}>Total Orders</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>98%</div>
            <div className={styles.statLabel}>Satisfaction Rate</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.actions}>
          <button
            className="btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            Add New Product
          </button>
          <Link href="/products/manage" className="btn-secondary">
            Manage Products
          </Link>
          <Link href="/products/add" className="btn-secondary">
            Bulk Import
          </Link>
        </div>

        {/* Recent Products */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Recent Products</h2>
          <div className={styles.productsGrid}>
            {products.slice(0, 6).map((product) => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productImage}>
                  <img src={product.imageUrl} alt={product.title} />
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productTitle}>{product.title}</h3>
                  <p className={styles.productCategory}>{product.category}</p>
                  <p className={styles.productPrice}>${product.price.toLocaleString()}</p>
                  <div className={styles.productActions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => setEditingProduct(product)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Product Modal */}
        {showAddForm && (
          <ProductForm
            onSubmit={handleAddProduct}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {/* Edit Product Modal */}
        {editingProduct && (
          <ProductForm
            product={editingProduct}
            onSubmit={(data) => {
              // In a real app, this would update the product
              console.log('Update product:', data);
              setEditingProduct(null);
              toast.success('Product updated successfully');
            }}
            onCancel={() => setEditingProduct(null)}
          />
        )}
      </div>
    </div>
  );
}

// Product Form Component
function ProductForm({ product, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: product?.title || '',
    shortDescription: product?.shortDescription || '',
    fullDescription: product?.fullDescription || '',
    price: product?.price || '',
    category: product?.category || 'Uncategorized',
    imageUrl: product?.imageUrl || '',
    priority: product?.priority || 'Normal',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseFloat(formData.price),
      addedBy: 'admin@lumina.com',
    });
  };

  const updateField = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>
          {product ? 'Edit Product' : 'Add New Product'}
        </h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className="label">Title</label>
            <input
              type="text"
              className="input"
              value={formData.title}
              onChange={updateField('title')}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className="label">Short Description</label>
            <input
              type="text"
              className="input"
              value={formData.shortDescription}
              onChange={updateField('shortDescription')}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className="label">Full Description</label>
            <textarea
              className="input"
              rows={4}
              value={formData.fullDescription}
              onChange={updateField('fullDescription')}
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className="label">Price</label>
              <input
                type="number"
                className="input"
                step="0.01"
                value={formData.price}
                onChange={updateField('price')}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className="label">Category</label>
              <select
                className="input"
                value={formData.category}
                onChange={updateField('category')}
              >
                <option value="Uncategorized">Uncategorized</option>
                <option value="Timepieces">Timepieces</option>
                <option value="Fragrance">Fragrance</option>
                <option value="Home">Home</option>
                <option value="Textiles">Textiles</option>
                <option value="Beauty">Beauty</option>
                <option value="Stationery">Stationery</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className="label">Image URL</label>
            <input
              type="url"
              className="input"
              value={formData.imageUrl}
              onChange={updateField('imageUrl')}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className="label">Priority</label>
            <select
              className="input"
              value={formData.priority}
              onChange={updateField('priority')}
            >
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Featured">Featured</option>
            </select>
          </div>

          <div className={styles.formActions}>
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {product ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}