'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { useCart } from '@/components/CartProvider';
import { useAuth } from '@/components/AuthProvider';
import styles from './page.module.css';

// Initialize Stripe
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, clearCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    zipCode: '',
    phone: ''
  });

  useEffect(() => {
    const secret = searchParams.get('clientSecret');
    if (secret) {
      setClientSecret(secret);
      setLoading(false);
    } else {
      // If no clientSecret, redirect back to cart
      router.push('/cart');
    }
  }, [searchParams, router]);

  const appearance = {
    theme: 'night',
    variables: {
      colorPrimary: '#c9a84c',
      colorBackground: '#1e1e28',
      colorText: '#f0ede6',
      colorDanger: '#e05454',
      fontFamily: "'DM Sans', sans-serif",
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.loading}>Loading checkout...</div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🛒</span>
            <h1>Your cart is empty</h1>
            <p>Add some items to your cart before checking out.</p>
            <button
              className="btn-primary"
              onClick={() => router.push('/products')}
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Checkout</h1>
          <p className={styles.subtitle}>Complete your purchase securely</p>
        </div>

        <div className={styles.layout}>
          {/* Order summary */}
          <div className={styles.summary}>
            <div className={styles.summaryCard}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>
              <div className={styles.items}>
                {cart.map((item) => (
                  <div key={item.id} className={styles.item}>
                    <div className={styles.itemInfo}>
                      <h3 className={styles.itemTitle}>{item.title}</h3>
                      <p className={styles.itemQty}>Quantity: {item.quantity}</p>
                    </div>
                    <p className={styles.itemPrice}>
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <div className={styles.summaryDivider} />
              <div className={styles.total}>
                <span>Total</span>
                <span>${getTotalPrice().toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment form */}
          <div className={styles.payment}>
            <div className={styles.paymentCard}>
              <h2 className={styles.paymentTitle}>Shipping Information</h2>
              <div className={styles.shippingForm}>
                <div className={styles.formGroup}>
                  <label className="label">Street Address</label>
                  <input 
                    type="text" 
                    className="input" 
                    placeholder="123 Luxury Ave"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                    required
                  />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className="label">City</label>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="New York"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className="label">ZIP Code</label>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="10001"
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className="label">Phone Number</label>
                  <input 
                    type="tel" 
                    className="input" 
                    placeholder="+1 (555) 000-0000"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className={styles.summaryDivider} style={{ margin: '32px 0' }} />

              <h2 className={styles.paymentTitle}>Payment Information</h2>
              {clientSecret && (
                <>
                  <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm
                      clientSecret={clientSecret}
                      amount={getTotalPrice() * 100} // Convert to cents
                      onSuccess={async () => {
                        try {
                          // Post order to MongoDB
                          const orderData = {
                            customer: {
                              email: user?.email || 'guest@lumina.com',
                              name: user?.displayName || 'Guest User',
                              shippingAddress: shippingAddress
                            },
                            items: cart.map(item => ({
                              id: item.id,
                              title: item.title,
                              price: item.price,
                              quantity: item.quantity,
                              imageUrl: item.imageUrl
                            })),
                            totalAmount: getTotalPrice(),
                            paymentMethod: 'Stripe',
                            paymentStatus: 'paid'
                          };
                          
                          await fetch('/api/orders', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(orderData)
                          });
                          
                          clearCart();
                          router.push('/checkout/success');
                        } catch (err) {
                          console.error('Order creation failed:', err);
                          // Still redirect to success since payment was confirmed
                          clearCart();
                          router.push('/checkout/success');
                        }
                      }}
                    />
                  </Elements>
                  <div className={styles.cancelAction}>
                    <button 
                      className={styles.cancelBtn}
                      onClick={() => router.push('/products')}
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M15 8H1M6 3L1 8l5 5"/>
                      </svg>
                      Cancel and Return to Catalog
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className={styles.page}>
        <div className="container">
          <div className={styles.loading}>Loading checkout...</div>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}