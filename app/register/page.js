'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import styles from '../login/page.module.css';

export default function RegisterPage() {
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'At least 6 characters';
    if (!form.confirm) errs.confirm = 'Please confirm your password';
    else if (form.confirm !== form.password) errs.confirm = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    try {
      await signUp(form.email, form.password, form.name.trim());
      toast.success('Account created successfully!');
      router.push('/');
    } catch (error) {
      toast.error('Failed to create account');
      setErrors({ form: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Account created successfully!');
      router.push('/');
    } catch (error) {
      toast.error('Google sign-up failed');
      console.error('Google sign-up error:', error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <div className={styles.card}>
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>✦</span>
            Lumina
          </Link>
          <h1 className={styles.title}>Create account</h1>
          <p className={styles.subtitle}>Join the Lumina marketplace today</p>
        </div>

        {/* Google Sign Up */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className={styles.googleBtn}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M16.51 7.56H9v2.88h4.84c-.2 1.04-.96 1.92-1.92 2.48v2.08h3.12c1.84-1.68 2.48-4.16 2.48-7.04 0-.68-.08-1.32-.2-1.92z" fill="#4285F4"/>
            <path d="M9 16.8c2.6 0 4.76-.88 6.36-2.36l-3.12-2.08c-.88.6-1.96.96-3.24.96-2.48 0-4.6-1.68-5.36-3.92H1.4v2.16C2.96 14.96 5.72 16.8 9 16.8z" fill="#34A853"/>
            <path d="M3.64 10.08C3.44 9.52 3.32 8.92 3.32 8.28s.12-.64.32-1.2V4.92H1.4C.8 6.08.48 7.16.48 8.28c0 1.12.32 2.2.92 3.16l2.24-1.36z" fill="#FBBC05"/>
            <path d="M9 3.52c1.4 0 2.68.48 3.68 1.44l2.76-2.76C13.76 1.2 11.6.48 9 .48 5.72.48 2.96 2.32 1.4 4.92L3.64 6.28C4.4 4.04 6.52 2.36 9 2.36z" fill="#EA4335"/>
          </svg>
          {googleLoading ? 'Creating account...' : 'Continue with Google'}
        </button>

        <div className={styles.divider}>
          <span>or with email</span>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.field}>
            <label className="label">Full name</label>
            <input
              className={`input ${errors.name ? styles.inputError : ''}`}
              placeholder="Your name"
              value={form.name}
              onChange={update('name')}
            />
            {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
          </div>

          <div className={styles.field}>
            <label className="label">Email address</label>
            <input
              type="email"
              className={`input ${errors.email ? styles.inputError : ''}`}
              placeholder="you@example.com"
              value={form.email}
              onChange={update('email')}
              autoComplete="email"
            />
            {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
          </div>

          <div className={styles.field}>
            <label className="label">Password</label>
            <input
              type="password"
              className={`input ${errors.password ? styles.inputError : ''}`}
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={update('password')}
            />
            {errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
          </div>

          <div className={styles.field}>
            <label className="label">Confirm password</label>
            <input
              type="password"
              className={`input ${errors.confirm ? styles.inputError : ''}`}
              placeholder="Repeat password"
              value={form.confirm}
              onChange={update('confirm')}
            />
            {errors.confirm && <span className={styles.errorMsg}>{errors.confirm}</span>}
          </div>

          <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? <><span className={styles.spinner} /> Creating account...</> : 'Create Account'}
          </button>
        </form>

        <p className={styles.switchLink}>
          Already have an account?{' '}
          <Link href="/login" className={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
