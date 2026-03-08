'use client';

import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import styles from './CheckoutForm.module.css';

export default function CheckoutForm({ clientSecret, amount, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (error) {
      console.error('Payment confirmation error:', error);
      toast.error(error.message || 'Payment failed');
      setLoading(false);
    } else {
      // Payment succeeded
      toast.success('Payment successful!');
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <PaymentElement
        options={{
          layout: 'tabs',
        }}
      />
      <button
        type="submit"
        disabled={!stripe || loading}
        className={styles.payBtn}
      >
        {loading ? 'Processing...' : `Pay $${(amount / 100).toLocaleString()}`}
      </button>
      <p className={styles.secure}>
        🔒 Your payment information is secure and encrypted
      </p>
    </form>
  );
}