'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import ProductImage from '@/components/ProductImage';
import { generateOrderReceipt, generateOrdersReport } from '@/lib/pdf-utils';
import Link from 'next/link';
import toast from 'react-hot-toast';
import styles from './page.module.css';

export default function AdminDashboard() {
  const { user, isAdmin, isStaff, isDelivery, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (!isStaff && !isDelivery) {
        router.push('/dashboard');
      }
    }
  }, [user, isStaff, isDelivery, loading, router]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
        setStats(prev => ({ ...prev, totalProducts: data.length }));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
        const revenue = data.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        setStats(prev => ({ ...prev, totalRevenue: revenue, totalOrders: data.length }));
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    if (user && (isStaff || isDelivery)) {
      fetchProducts();
      fetchOrders();
    }
  }, [user, isStaff, isDelivery]);

  const handleDeleteProduct = async (productId) => {
    if (confirm('Delete this product?')) {
      try {
        const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
        if (res.ok) {
          fetchProducts();
          toast.success('Product deleted');
        }
      } catch (error) {
        toast.error('Failed to delete product');
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
        fetchProducts();
        setShowAddForm(false);
        toast.success('Product added');
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
        fetchProducts();
        setEditingProduct(null);
        toast.success('Product updated');
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
        fetchOrders();
        toast.success(`Status updated`);
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
          fetchOrders();
          toast.success('Order deleted');
        } else {
          toast.error('Failed to delete order');
        }
      } catch (error) {
        toast.error('Error deleting order');
      }
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setShowUserForm(false);
      } else {
        toast.error(data.error || 'Failed to create user');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!user || (!isStaff && !isDelivery)) {
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
          <div className={`${styles.statCard} ${styles.reportCard}`} onClick={() => generateOrdersReport(orders)}>
            <div className={styles.reportIcon}>📄</div>
            <div className={styles.statLabel}>Download Full Report</div>
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
          {isAdmin && (
            <button
              className="btn-secondary"
              onClick={() => setShowUserForm(true)}
            >
              Add Staff/Delivery
            </button>
          )}
          <Link href="/products/manage" className="btn-secondary">
            Manage Products
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
                  <ProductImage 
                    src={product.imageUrl} 
                    alt={product.title} 
                    width={40} 
                    height={40} 
                    className={styles.listThumb}
                  />
                  <div className={styles.listInfo}>
                    <h3 className={styles.listTitle}>{product.title}</h3>
                    <p className={styles.listMeta}>{product.category} • ${product.price.toLocaleString()}</p>
                  </div>
                  <div className={styles.listActions}>
                    <button onClick={() => setEditingProduct(product)}>Edit</button>
                    {isAdmin && (
                      <button onClick={() => handleDeleteProduct(product.id)} className={styles.deleteText}>Delete</button>
                    )}
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
                    {order.customer?.shippingAddress && (
                      <p className={styles.orderAddress}>
                        📍 {order.customer.shippingAddress.street}, {order.customer.shippingAddress.city} • {order.customer.shippingAddress.phone}
                      </p>
                    )}
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
                    <div className={styles.orderBtnGroup}>
                      <button 
                        className={styles.receiptBtn}
                        onClick={() => generateOrderReceipt(order)}
                        title="Download Receipt (PDF)"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                        </svg>
                      </button>
                      {isAdmin && (
                        <button 
                          className={styles.deleteOrderBtn}
                          onClick={() => handleDeleteOrder(order._id || order.id)}
                          title="Delete Order"
                        >
                          ×
                        </button>
                      )}
                    </div>
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

        {/* Add User Modal */}
        {showUserForm && (
          <UserForm
            onSubmit={handleCreateUser}
            onCancel={() => setShowUserForm(false)}
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
  const { user } = useAuth();
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
      addedBy: user?.email || 'admin@lumina.com',
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

// User Creation Form Component
function UserForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Add Staff or Delivery</h2>
          <button className={styles.closeBtn} onClick={onCancel}>×</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className="label">Full Name</label>
            <input
              type="text"
              className="input"
              value={formData.name}
              onChange={updateField('name')}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className="label">Email Address</label>
            <input
              type="email"
              className="input"
              value={formData.email}
              onChange={updateField('email')}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className="label">Temporary Password</label>
            <input
              type="password"
              className="input"
              value={formData.password}
              onChange={updateField('password')}
              required
              minLength={6}
            />
          </div>

          <div className={styles.formGroup}>
            <label className="label">Role</label>
            <select
              className="input"
              value={formData.role}
              onChange={updateField('role')}
            >
              <option value="staff">Staff / Manager</option>
              <option value="delivery">Delivery Personnel</option>
              <option value="admin">Secondary Admin</option>
            </select>
          </div>

          <div className={styles.formActions}>
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}