'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { useCart } from '@/components/CartProvider';
import styles from './page.module.css';

// Initialize Stripe
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, clearCart, getTotalPrice } = useCart();
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);

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
              <h2 className={styles.paymentTitle}>Payment Information</h2>
              {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                  <CheckoutForm
                    clientSecret={clientSecret}
                    amount={getTotalPrice() * 100} // Convert to cents
                    onSuccess={() => {
                      clearCart();
                      router.push('/checkout/success');
                    }}
                  />
                </Elements>
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