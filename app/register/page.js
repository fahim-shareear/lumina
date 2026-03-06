'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import styles from '../login/page.module.css';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
      await signUp(form.email, form.password);
      toast.success('Account created successfully!');
      router.push('/');
    } catch (error) {
      toast.error('Failed to create account');
      setErrors({ form: error.message });
    } finally {
      setLoading(false);
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
