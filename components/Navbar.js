'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import styles from './Navbar.module.css';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Catalog' },
  { href: '/#features', label: 'Features' },
  { href: '/#about', label: 'About' },
];

export default function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const avatarInitial = user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?';

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>✦</span>
          <span>Lumina</span>
        </Link>

        {/* Desktop nav links */}
        <ul className={styles.links}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${styles.link} ${pathname === link.href ? styles.active : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Auth area */}
        <div className={styles.authArea}>
          {user ? (
            <div className={styles.userMenu} ref={dropdownRef}>
              <button
                className={styles.avatarBtn}
                onClick={() => setDropdownOpen((o) => !o)}
                aria-expanded={dropdownOpen}
              >
                {user.photoURL ? (
                  <Image src={user.photoURL} alt={user.displayName} className={styles.avatarImg} width={32} height={32} />
                ) : (
                  <span className={styles.avatarInitial}>{avatarInitial}</span>
                )}
                <span className={styles.userName}>{user.displayName?.split(' ')[0] || user.email?.split('@')[0]}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" style={{ opacity: 0.6 }}>
                  <path d="M6 8L1 3h10z"/>
                </svg>
              </button>

              {dropdownOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>
                    <p className={styles.dropdownName}>{user.displayName || user.email?.split('@')[0]}</p>
                    <p className={styles.dropdownEmail}>{user.email}</p>
                  </div>
                  <div className={styles.dropdownDivider} />
                  <Link href="/products/add" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M7.5 1v13M1 7.5h13"/>
                    </svg>
                    Add Product
                  </Link>
                  <Link href="/products/manage" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="1" y="1" width="5" height="5" rx="1"/>
                      <rect x="9" y="1" width="5" height="5" rx="1"/>
                      <rect x="1" y="9" width="5" height="5" rx="1"/>
                      <rect x="9" y="9" width="5" height="5" rx="1"/>
                    </svg>
                    Manage Products
                  </Link>
                  <div className={styles.dropdownDivider} />
                  <button
                    className={`${styles.dropdownItem} ${styles.dropdownSignOut}`}
                    onClick={() => { setDropdownOpen(false); signOut(); }}
                  >
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 1H2a1 1 0 00-1 1v11a1 1 0 001 1h3M10 11l4-4-4-4M14 7.5H5"/>
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link href="/login" className="btn-secondary" style={{ padding: '9px 20px', fontSize: '0.85rem' }}>
                Sign In
              </Link>
              <Link href="/register" className="btn-primary" style={{ padding: '9px 20px', fontSize: '0.85rem' }}>
                Register
              </Link>
            </div>
          )}

          {/* Hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span className={`${styles.bar} ${menuOpen ? styles.bar1Open : ''}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.bar2Open : ''}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.bar3Open : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {session ? (
            <>
              <Link href="/products/add" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Add Product</Link>
              <Link href="/products/manage" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Manage Products</Link>
              <button className={`${styles.mobileLink} ${styles.mobileSignOut}`} onClick={() => { setMenuOpen(false); signOut({ callbackUrl: '/' }); }}>
                Sign Out
              </button>
            </>
          ) : (
            <div className={styles.mobileAuth}>
              <Link href="/login" className="btn-secondary" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link href="/register" className="btn-primary" onClick={() => setMenuOpen(false)}>Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
