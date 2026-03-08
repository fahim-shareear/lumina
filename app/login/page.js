'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import styles from './page.module.css';

export default function LoginPage() {
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email';
    if (!password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    try {
      await signIn(email, password);
      toast.success('Welcome back!');
      router.push('/');
    } catch (error) {
      toast.error('Invalid email or password');
      setErrors({ form: 'Invalid credentials' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Welcome back!');
      router.push('/');
    } catch (error) {
      toast.error('Google sign-in failed');
      console.error('Google sign-in error:', error);
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
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Sign in to your account to continue</p>
        </div>

        {/* Demo hint */}
        <div className={styles.demoHint}>
          <strong>Demo:</strong> demo@lumina.com / demo123
        </div>

        {/* Google Sign In */}
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
          {googleLoading ? 'Signing in...' : 'Continue with Google'}
        </button>

        <div className={styles.divider}>
          <span>or continue with email</span>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {errors.form && <div className={styles.formError}>{errors.form}</div>}

          <div className={styles.field}>
            <label className="label">Email address</label>
            <input
              type="email"
              className={`input ${errors.email ? styles.inputError : ''}`}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
          </div>

          <div className={styles.field}>
            <label className="label">Password</label>
            <input
              type="password"
              className={`input ${errors.password ? styles.inputError : ''}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            {errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
          </div>

          <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? (
              <><span className={styles.spinner} /> Signing in...</>
            ) : 'Sign In'}
          </button>
        </form>

        <p className={styles.switchLink}>
          Don&apos;t have an account?{' '}
          <Link href="/register" className={styles.link}>Create one</Link>
        </p>
      </div>
    </div>
  );
}
