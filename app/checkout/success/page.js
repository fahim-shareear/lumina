import Link from 'next/link';
import styles from './page.module.css';

export default function CheckoutSuccessPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.success}>
          <span className={styles.successIcon}>✓</span>
          <h1 className={styles.title}>Payment Successful!</h1>
          <p className={styles.message}>
            Thank you for your purchase. Your order has been confirmed and you will receive a confirmation email shortly.
          </p>
          <div className={styles.actions}>
            <Link href="/products" className="btn-primary">
              Continue Shopping
            </Link>
            <Link href="/" className="btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}