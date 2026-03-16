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

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (error) {
      console.error('Payment confirmation error:', error);
      toast.error(error.message || 'Payment failed');
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Payment succeeded immediately
      toast.success('Payment successful!');
      await onSuccess();
      // Success redirection is handled in onSuccess in page.js, 
      // but we add a fallback here just in case.
      window.location.href = '/checkout/success';
    } else {
      // paymentIntent status is processing or requires_action (redirect happened/is happening)
      // If redirect: 'if_required' leads to a redirect, this code won't run.
      // If it doesn't redirect but isn't 'succeeded' yet, we just wait or show processing.
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