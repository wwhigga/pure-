'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Phone, Sparkles, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './profile.module.css';

export default function Profile() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    fetch('/api/auth/me')
      .then(res => {
        if (res.ok) {
          router.push('/dashboard');
        } else {
          setCheckingAuth(false);
        }
      })
      .catch(() => {
        setCheckingAuth(false);
      });
  }, [router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Ошибка при входе');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Ошибка при регистрации');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <div className={styles.loading}>Проверка авторизации...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <section className={styles.formSection}>
          <div className={styles.formContainer}>
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}
            
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.formHeader}>
                    <h1 className={styles.formTitle}>Вход</h1>
                    <p className={styles.formSubtitle}>
                      Войдите в свой аккаунт для продолжения
                    </p>
                  </div>

                  <form className={styles.form} onSubmit={handleLogin}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Email</label>
                      <div className={styles.inputWrapper}>
                        <Mail size={20} className={styles.inputIcon} />
                        <input
                          type="email"
                          name="email"
                          className={styles.input}
                          placeholder="example@mail.com"
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Пароль</label>
                      <div className={styles.inputWrapper}>
                        <Lock size={20} className={styles.inputIcon} />
                        <input
                          type="password"
                          name="password"
                          className={styles.input}
                          placeholder="Введите пароль"
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.forgotPassword}>
                      <a href="#" className={styles.link}>
                        Забыли пароль?
                      </a>
                    </div>

                    <button type="submit" className={styles.submitButton} disabled={loading}>
                      {loading ? 'Вход...' : 'Войти'}
                    </button>

                    <div className={styles.formFooter}>
                      <p className={styles.footerText}>
                        Нет аккаунта?{' '}
                        <button
                          type="button"
                          onClick={() => { setIsLogin(false); setError(''); }}
                          className={styles.linkButton}
                        >
                          Зарегистрироваться
                        </button>
                      </p>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.formHeader}>
                    <h1 className={styles.formTitle}>Регистрация</h1>
                    <p className={styles.formSubtitle}>
                      Создайте аккаунт для доступа ко всем возможностям
                    </p>
                  </div>

                  <form className={styles.form} onSubmit={handleRegister}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Имя</label>
                      <div className={styles.inputWrapper}>
                        <User size={20} className={styles.inputIcon} />
                        <input
                          type="text"
                          name="name"
                          className={styles.input}
                          placeholder="Введите ваше имя"
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Email</label>
                      <div className={styles.inputWrapper}>
                        <Mail size={20} className={styles.inputIcon} />
                        <input
                          type="email"
                          name="email"
                          className={styles.input}
                          placeholder="example@mail.com"
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Телефон</label>
                      <div className={styles.inputWrapper}>
                        <Phone size={20} className={styles.inputIcon} />
                        <input
                          type="tel"
                          name="phone"
                          className={styles.input}
                          placeholder="+7 (999) 999-99-99"
                        />
                      </div>
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Пароль</label>
                      <div className={styles.inputWrapper}>
                        <Lock size={20} className={styles.inputIcon} />
                        <input
                          type="password"
                          name="password"
                          className={styles.input}
                          placeholder="Минимум 8 символов"
                          required
                          minLength={8}
                        />
                      </div>
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Подтвердите пароль</label>
                      <div className={styles.inputWrapper}>
                        <Lock size={20} className={styles.inputIcon} />
                        <input
                          type="password"
                          name="confirmPassword"
                          className={styles.input}
                          placeholder="Повторите пароль"
                          required
                          minLength={8}
                        />
                      </div>
                    </div>

                    <button type="submit" className={styles.submitButton} disabled={loading}>
                      {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>

                    <div className={styles.formFooter}>
                      <p className={styles.footerText}>
                        Уже есть аккаунт?{' '}
                        <button
                          type="button"
                          onClick={() => { setIsLogin(true); setError(''); }}
                          className={styles.linkButton}
                        >
                          Войти
                        </button>
                      </p>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            className={styles.sideVisual}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login-visual"
                  className={styles.visualContent}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.statBox}>
                    <div className={styles.statNumber}>5000+</div>
                    <div className={styles.statLabel}>Клиентов</div>
                  </div>
                  <div className={styles.textBox}>PURE</div>
                </motion.div>
              ) : (
                <motion.div
                  key="register-visual"
                  className={styles.visualGrid}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.visualItem}>
                    <Sparkles size={40} strokeWidth={1.5} />
                  </div>
                  <div className={styles.visualItem}>
                    <div className={styles.miniStat}>
                      <div className={styles.miniNumber}>98%</div>
                    </div>
                  </div>
                  <div className={styles.visualItem}>
                    <div className={styles.miniText}>PURE</div>
                  </div>
                  <div className={styles.visualItem}>
                    <Shield size={40} strokeWidth={1.5} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
