'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import styles from './page.module.css';

export default function ProfilePage() {
  const { user, loading, updateUserProfile, updateUserPassword } = useAuth();
  const router = useRouter();
  
  const [profileForm, setProfileForm] = useState({
    displayName: '',
    photoURL: '',
  });
  
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    
    if (user) {
      setProfileForm({
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
      });
    }
  }, [user, loading, router]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      await updateUserProfile({
        displayName: profileForm.displayName,
        photoURL: profileForm.photoURL,
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await updateUserPassword(passwordForm.newPassword);
      toast.success('Password updated successfully');
      setPasswordForm({ newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Update password error:', error);
      toast.error(error.message || 'Failed to update password. You may need to re-login.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  if (!user) return null;

  return (
    <div className={styles.page}>
      <div className="container">
        <Link href="/dashboard" className={styles.back}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 10H5M10 15l-5-5 5-5"/>
          </svg>
          Back to Dashboard
        </Link>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>Account Settings</h1>
            <p className={styles.subtitle}>Manage your profile and security</p>
          </div>

          <div className={styles.content}>
            {/* Profile Info Section */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Profile Information</h2>
              <form onSubmit={handleProfileSubmit}>
                <div className={styles.avatarSection}>
                  <div className={styles.avatarPreview}>
                    {profileForm.photoURL ? (
                      <img src={profileForm.photoURL} alt="Avatar" className={styles.avatarImg} />
                    ) : (
                      <span>{profileForm.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}</span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="label">Profile Image URL</label>
                    <input
                      type="url"
                      className="input"
                      placeholder="https://example.com/image.jpg"
                      value={profileForm.photoURL}
                      onChange={(e) => setProfileForm({ ...profileForm, photoURL: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    className="input"
                    value={profileForm.displayName}
                    onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className="label">Email Address</label>
                  <input
                    type="email"
                    className="input"
                    value={user.email}
                    disabled
                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                  />
                  <p className={styles.subtitle} style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                    Email cannot be changed
                  </p>
                </div>

                <button 
                  type="submit" 
                  className={`btn-primary ${styles.submitBtn}`} 
                  disabled={isUpdatingProfile}
                >
                  {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </section>

            {/* Password Section */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Change Password</h2>
              <form onSubmit={handlePasswordSubmit}>
                <div className={styles.formGroup}>
                  <label className="label">New Password</label>
                  <input
                    type="password"
                    className="input"
                    placeholder="Min. 6 characters"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className="label">Confirm New Password</label>
                  <input
                    type="password"
                    className="input"
                    placeholder="Repeat new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className={`btn-secondary ${styles.submitBtn}`} 
                  disabled={isUpdatingPassword}
                >
                  {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
