'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import ProductImage from '@/components/ProductImage';
import NextImage from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { useCart } from '@/components/CartProvider';
import styles from './Navbar.module.css';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Catalog' },
  { href: '/#features', label: 'Features' },
  { href: '/#about', label: 'About' },
];

export default function Navbar() {
  const { user, signOut, isAdmin, isStaff, isDelivery } = useAuth();
  const { getTotalItems, cart, getTotalPrice, removeFromCart } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const cartRef = useRef(null);

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
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setCartOpen(false);
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
          {/* Cart */}
          <div className={styles.cartWrapper} ref={cartRef}>
            <button
              className={styles.cartLink}
              onClick={() => setCartOpen((o) => !o)}
              aria-label="Cart"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="8" cy="19" r="1"/>
                <circle cx="16" cy="19" r="1"/>
                <path d="M1 1h3l1.68 10.39a2 2 0 002 1.61h9.72a2 2 0 001.99-1.79l1.2-7.21H5"/>
              </svg>
              {getTotalItems() > 0 && (
                <span className={styles.cartBadge}>{getTotalItems()}</span>
              )}
            </button>

            {cartOpen && (
              <div className={styles.cartDropdown}>
                <div className={styles.cartDropdownHeader}>
                  <span className={styles.cartDropdownTitle}>Cart</span>
                  <span className={styles.cartDropdownCount}>{getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''}</span>
                </div>

                {cart.length === 0 ? (
                  <div className={styles.cartEmpty}>
                    <svg width="32" height="32" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.3">
                      <circle cx="8" cy="19" r="1"/>
                      <circle cx="16" cy="19" r="1"/>
                      <path d="M1 1h3l1.68 10.39a2 2 0 002 1.61h9.72a2 2 0 001.99-1.79l1.2-7.21H5"/>
                    </svg>
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className={styles.cartItems}>
                      {cart.map((item) => (
                        <div key={item.id} className={styles.cartItem}>
                          {item.imageUrl && (
                            <div className={styles.cartItemImg}>
                              <ProductImage 
                                src={item.imageUrl} 
                                alt={item.title} 
                                width={40} 
                                height={40} 
                                className={styles.thumb}
                              />
                            </div>
                          )}
                          <div className={styles.cartItemInfo}>
                            <p className={styles.cartItemName}>{item.title}</p>
                            <p className={styles.cartItemMeta}>
                              Qty: {item.quantity} &nbsp;·&nbsp; ${(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                          <button 
                            className={styles.cartItemRemove}
                            onClick={() => removeFromCart(item.id)}
                            aria-label="Remove item"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className={styles.cartDropdownFooter}>
                      <div className={styles.cartSubtotal}>
                        <span>Subtotal</span>
                        <span>${getTotalPrice().toLocaleString()}</span>
                      </div>
                      <button
                        className={styles.cartViewBtn}
                        onClick={() => { setCartOpen(false); router.push('/cart'); }}
                      >
                        View Cart & Checkout
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          {user ? (
            <div className={styles.userMenu} ref={dropdownRef}>
              <button
                className={styles.avatarBtn}
                onClick={() => setDropdownOpen((o) => !o)}
                aria-expanded={dropdownOpen}
              >
                {user.photoURL ? (
                  <NextImage src={user.photoURL} alt={user.displayName} className={styles.avatarImg} width={32} height={32} />
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
                  {isStaff && (
                    <>
                      <Link href="/products/add" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M7.5 1v13M1 7.5h13"/>
                        </svg>
                        Add Product
                      </Link>
                      <Link href="/admin" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="1" y="1" width="13" height="13" rx="2"/>
                          <circle cx="7.5" cy="7.5" r="2"/>
                        </svg>
                        {isAdmin ? 'Admin Dashboard' : 'Management'}
                      </Link>
                      <div className={styles.dropdownDivider} />
                    </>
                  )}
                <Link href="/profile" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M16 17v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="10" cy="7" r="4"/>
                  </svg>
                  Edit Profile
                </Link>
                {!isAdmin && (
                  <Link href="/dashboard" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="14" height="14" rx="2"/>
                      <path d="M3 9h14M9 21V9"/>
                    </svg>
                    Dashboard
                  </Link>
                )}
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
          {user ? (
            <>
              {isAdmin && (
                <>
                  <Link href="/products/add" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Add Product</Link>
                  <Link href="/products/manage" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Manage Products</Link>
                </>
              )}
              <button className={`${styles.mobileLink} ${styles.mobileSignOut}`} onClick={() => { setMenuOpen(false); signOut(); }}>
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
