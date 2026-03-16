'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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

    // Load user orders from localStorage (in production, this would be from a database)
    const savedOrders = localStorage.getItem(`orders_${user?.uid}`);
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        setOrders(parsedOrders);

        // Calculate stats
        const totalSpent = parsedOrders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = parsedOrders.length;
        const totalItems = parsedOrders.reduce((sum, order) => sum + order.items.length, 0);

        setStats({ totalSpent, totalOrders, totalItems });
      } catch (error) {
        console.error('Error parsing orders from localStorage:', error);
      }
    }
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
                    <div className={styles.orderId}>Order #{order.id}</div>
                    <div className={styles.orderDate}>{new Date(order.date).toLocaleDateString()}</div>
                    <div className={styles.orderStatus}>Completed</div>
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
                    <span>Total: ${order.total.toLocaleString()}</span>
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