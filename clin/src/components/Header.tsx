'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { User, LogOut, Calendar, CreditCard, Menu, X } from 'lucide-react';
import Link from 'next/link';
import styles from './Header.module.css';

interface UserData {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
}

export default function Header() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setIsMenuOpen(false);
      setIsMobileMenuOpen(false);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          PURE
        </Link>

        {/* Desktop Navigation */}
        <motion.div 
          className={styles.navLinks}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link href="/">Главная</Link>
          <Link href="/services">Услуги</Link>
          <Link href="/order?service=general">Заказать</Link>
          
          {!loading && (
            <>
              {user ? (
                <div className={styles.profileWrapper} ref={menuRef}>
                  <button
                    className={styles.profileButton}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <div className={styles.avatar}>
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.name} className={styles.avatarImage} />
                      ) : (
                        <span className={styles.avatarInitials}>{getInitials(user.name)}</span>
                      )}
                    </div>
                    <span className={styles.userName}>{user.name}</span>
                  </button>

                  <AnimatePresence>
                    {isMenuOpen && (
                      <motion.div
                        className={styles.dropdown}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className={styles.dropdownHeader}>
                          <div className={styles.dropdownAvatar}>
                            {user.avatar_url ? (
                              <img src={user.avatar_url} alt={user.name} />
                            ) : (
                              <span>{getInitials(user.name)}</span>
                            )}
                          </div>
                          <div className={styles.dropdownInfo}>
                            <div className={styles.dropdownName}>{user.name}</div>
                            <div className={styles.dropdownEmail}>{user.email}</div>
                          </div>
                        </div>

                        <div className={styles.dropdownDivider}></div>

                        <Link href="/dashboard" className={styles.dropdownItem}>
                          <User size={18} />
                          <span>Личный кабинет</span>
                        </Link>

                        <Link href="/dashboard?tab=orders" className={styles.dropdownItem}>
                          <Calendar size={18} />
                          <span>Мои заказы</span>
                        </Link>

                        <Link href="/dashboard?tab=payment" className={styles.dropdownItem}>
                          <CreditCard size={18} />
                          <span>Оплата</span>
                        </Link>

                        <div className={styles.dropdownDivider}></div>

                        <button onClick={handleLogout} className={styles.dropdownItem}>
                          <LogOut size={18} />
                          <span>Выйти</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/profile" className={styles.loginButton}>
                  Войти
                </Link>
              )}
            </>
          )}
        </motion.div>

        {/* Mobile Menu Button */}
        {!loading && (
          <button 
            className={styles.mobileMenuButton}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </nav>

      {/* Mobile Navigation Overlay - Outside nav for full screen coverage */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className={styles.mobileOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeMobileMenu}
            />
            <motion.div
              className={styles.mobileMenu}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className={styles.mobileMenuHeader}>
                <Link href="/" className={styles.mobileMenuTitle}>
                  PURE
                </Link>
                <button 
                  className={styles.mobileCloseButton}
                  onClick={closeMobileMenu}
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <div className={styles.mobileMenuContent}>
                {user && (
                  <div className={styles.mobileUserInfo}>
                    <div className={styles.mobileAvatar}>
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.name} />
                      ) : (
                        <span>{getInitials(user.name)}</span>
                      )}
                    </div>
                    <div className={styles.mobileUserDetails}>
                      <div className={styles.mobileUserName}>{user.name}</div>
                      <div className={styles.mobileUserEmail}>{user.email}</div>
                    </div>
                  </div>
                )}

                <div className={styles.mobileLinks}>
                  <Link href="/" onClick={closeMobileMenu}>Главная</Link>
                  <Link href="/services" onClick={closeMobileMenu}>Услуги</Link>
                  <Link href="/order?service=general" onClick={closeMobileMenu}>Заказать</Link>
                  
                  {user && (
                    <>
                      <div className={styles.mobileDivider}></div>
                      <Link href="/dashboard" onClick={closeMobileMenu}>
                        <User size={20} />
                        <span>Личный кабинет</span>
                      </Link>
                      <Link href="/dashboard?tab=orders" onClick={closeMobileMenu}>
                        <Calendar size={20} />
                        <span>Мои заказы</span>
                      </Link>
                      <Link href="/dashboard?tab=payment" onClick={closeMobileMenu}>
                        <CreditCard size={20} />
                        <span>Оплата</span>
                      </Link>
                    </>
                  )}
                </div>

                {user ? (
                  <button onClick={handleLogout} className={styles.mobileLogoutButton}>
                    <LogOut size={20} />
                    <span>Выйти</span>
                  </button>
                ) : (
                  <Link href="/profile" className={styles.mobileLoginButton} onClick={closeMobileMenu}>
                    Войти
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
