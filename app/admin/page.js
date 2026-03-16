'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import styles from './page.module.css';

export default function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
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

    // Load data
    fetchProducts();
    fetchOrders();
  }, [user, loading, isAdmin, router]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
      setStats(prev => ({
        ...prev,
        totalProducts: data.length,
      }));
    } catch (error) {
      toast.error('Failed to load products');
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders/all');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
        
        const revenue = data.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        
        setStats(prev => ({
          ...prev,
          totalRevenue: revenue,
          totalOrders: data.length,
        }));
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
        if (res.ok) {
          setProducts(products.filter(p => p.id !== productId));
          toast.success('Product deleted successfully');
          setStats(prev => ({ ...prev, totalProducts: prev.totalProducts - 1 }));
        } else {
          toast.error('Failed to delete product');
        }
      } catch (error) {
        toast.error('Error deleting product');
      }
    }
  };

  const handleAddProduct = async (productData) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      
      if (res.ok) {
        const newProduct = await res.json();
        setProducts([...products, newProduct]);
        setShowAddForm(false);
        toast.success('Product added successfully');
        setStats(prev => ({ ...prev, totalProducts: prev.totalProducts + 1 }));
      } else {
        toast.error('Failed to add product');
      }
    } catch (error) {
      toast.error('Error adding product');
    }
  };

  const handleUpdateProduct = async (id, productData) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      
      if (res.ok) {
        const updated = await res.json();
        setProducts(products.map(p => p.id === id ? updated : p));
        setEditingProduct(null);
        toast.success('Product updated successfully');
      } else {
        toast.error('Failed to update product');
      }
    } catch (error) {
      toast.error('Error updating product');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (res.ok) {
        setOrders(orders.map(o => (o._id === orderId || o.id === orderId) ? { ...o, status: newStatus } : o));
        toast.success(`Order marked as ${newStatus}`);
      } else {
        toast.error('Failed to update order status');
      }
    } catch (error) {
      toast.error('Error updating order');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
        if (res.ok) {
          setOrders(orders.filter(o => (o._id !== orderId && o.id !== orderId)));
          toast.success('Order deleted');
          setStats(prev => ({ ...prev, totalOrders: prev.totalOrders - 1 }));
        } else {
          toast.error('Failed to delete order');
        }
      } catch (error) {
        toast.error('Error deleting order');
      }
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

        {/* Main Content Grid */}
        <div className={styles.dashboardGrid}>
          {/* Recent Products */}
          <div className={styles.section}>
            <div className={styles.sectionHeaderLine}>
              <h2 className={styles.sectionTitle}>Recent Products</h2>
              <Link href="/products" className={styles.viewAll}>View all</Link>
            </div>
            <div className={styles.productsList}>
              {products.slice(0, 5).map((product) => (
                <div key={product.id} className={styles.listItem}>
                  <Image 
                    src={product.imageUrl} 
                    alt={product.title} 
                    width={40} 
                    height={40} 
                    className={styles.listThumb}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'; }}
                  />
                  <div className={styles.listInfo}>
                    <h3 className={styles.listTitle}>{product.title}</h3>
                    <p className={styles.listMeta}>{product.category} • ${product.price.toLocaleString()}</p>
                  </div>
                  <div className={styles.listActions}>
                    <button onClick={() => setEditingProduct(product)}>Edit</button>
                    <button onClick={() => handleDeleteProduct(product.id)} className={styles.deleteText}>Delete</button>
                  </div>
                </div>
              ))}
              {products.length === 0 && <p className={styles.emptyText}>No products found.</p>}
            </div>
          </div>

          {/* Recent Orders */}
          <div className={styles.section}>
            <div className={styles.sectionHeaderLine}>
              <h2 className={styles.sectionTitle}>Recent Orders</h2>
              <button className={styles.viewAll} onClick={fetchOrders}>Refresh</button>
            </div>
            <div className={styles.ordersList}>
              {orders.slice(0, 5).map((order) => (
                <div key={order._id || order.id} className={styles.listItem}>
                  <div className={styles.listInfo}>
                    <h3 className={styles.listTitle}>{order.customer?.name || 'Guest'}</h3>
                    <p className={styles.listMeta}>{order.items?.length || 0} items • ${order.totalAmount?.toLocaleString()}</p>
                    <p className={styles.listSubMeta}>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className={styles.orderStatus}>
                    <select 
                      className={styles.statusSelect}
                      value={order.status || 'pending'}
                      onChange={(e) => handleUpdateOrderStatus(order._id || order.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button 
                      className={styles.deleteOrderBtn}
                      onClick={() => handleDeleteOrder(order._id || order.id)}
                      title="Delete Order"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
              {orders.length === 0 && <p className={styles.emptyText}>No orders yet.</p>}
            </div>
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
            onSubmit={(data) => handleUpdateProduct(editingProduct.id, data)}
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