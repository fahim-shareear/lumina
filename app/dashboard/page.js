'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { generateOrderReceipt } from '@/lib/pdf-utils';
import styles from './page.module.css';

export default function DashboardPage() {
  const { user, role, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalSpent: 0,
    totalOrders: 0,
    totalItems: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (!loading && isAdmin) {
      router.push('/admin');
      return;
    }

    // Load user orders from MongoDB API
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/orders?email=${user.email}`);
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
          
          const totalSpent = data.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
          const totalOrders = data.length;
          const totalItems = data.reduce((sum, order) => sum + (order.items?.length || 0), 0);
          
          setStats({ totalSpent, totalOrders, totalItems });
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [user, loading, isAdmin, router]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>My Dashboard</h1>
          <p className={styles.subtitle}>Welcome back, {user.displayName || user.email}!</p>
        </div>

        {/* Stats Cards */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>${stats.totalSpent.toLocaleString()}</div>
            <div className={styles.statLabel}>Total Spent</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.totalOrders}</div>
            <div className={styles.statLabel}>Total Orders</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.totalItems}</div>
            <div className={styles.statLabel}>Items Purchased</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>0</div>
            <div className={styles.statLabel}>Returns</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.actions}>
          <Link href="/products" className="btn-primary">
            Continue Shopping
          </Link>
          <Link href="/cart" className="btn-secondary">
            View Cart
          </Link>
        </div>

        {/* Recent Orders */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Recent Orders</h2>
          {orders.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>🛒</span>
              <h3>No orders yet</h3>
              <p>Start shopping to see your order history here.</p>
              <Link href="/products" className="btn-primary">Browse Products</Link>
            </div>
          ) : (
            <div className={styles.orders}>
              {orders.slice(0, 5).map((order, index) => (
                <div key={index} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div className={styles.orderId}>Order #{order._id || order.id}</div>
                    <div className={styles.orderDate}>{new Date(order.createdAt || order.date).toLocaleDateString()}</div>
                    <div className={styles.orderHeaderActions}>
                      <div className={styles.orderMeta}>
                        <span className={`${styles.orderStatus} ${styles[`status_${order.status || 'pending'}`]}`}>
                          {order.status || 'Pending'}
                        </span>
                        {order.shippedAt && order.status === 'shipped' && (
                          <span className={styles.metaTime}>Shipped: {new Date(order.shippedAt).toLocaleDateString()}</span>
                        )}
                        {order.deliveredAt && order.status === 'delivered' && (
                          <span className={styles.metaTime}>Arrived: {new Date(order.deliveredAt).toLocaleDateString()}</span>
                        )}
                      </div>
                      <button 
                        className={styles.receiptBtn}
                        onClick={() => generateOrderReceipt(order)}
                        title="Download Receipt"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className={styles.orderItems}>
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className={styles.orderItem}>
                        <div className={styles.itemInfo}>
                          <span className={styles.itemName}>{item.title}</span>
                          <span className={styles.itemQty}>Qty: {item.quantity}</span>
                        </div>
                        <span className={styles.itemPrice}>${(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.orderTotal}>
                    <span>Total: ${(order.totalAmount || order.total || 0).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Account Settings */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Account Settings</h2>
          <div className={styles.settings}>
            <div className={styles.settingItem}>
              <div className={styles.settingLabel}>Email</div>
              <div className={styles.settingValue}>{user.email}</div>
            </div>
            <div style={{ marginTop: '20px' }}>
              <Link href="/profile" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                Edit Profile
              </Link>
            </div>
            <div className={styles.settingItem}>
              <div className={styles.settingLabel}>Account Type</div>
              <div className={styles.settingValue}>Customer</div>
            </div>
            <div className={styles.settingItem}>
              <div className={styles.settingLabel}>Member Since</div>
              <div className={styles.settingValue}>
                {user.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString()
                  : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}