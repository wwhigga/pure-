'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Mail, Phone, LogOut, Calendar, TrendingUp, Award, Settings, Bell, CreditCard, Clock, CheckCircle, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './dashboard.module.css';

interface UserData {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  card_number?: string;
  card_holder?: string;
  card_expiry?: string;
  created_at: string;
}

interface Order {
  id: number;
  service_name: string;
  price: number;
  address: string;
  date: string;
  time: string;
  status: string;
  created_at: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
    fetchOrders();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      
      if (!res.ok) {
        router.push('/profile');
        return;
      }

      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
      router.push('/profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5MB');
      return;
    }

    setUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const res = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Ошибка при загрузке аватара');
        return;
      }

      // Update user state with new avatar
      setUser(prev => prev ? { ...prev, avatar_url: data.avatarUrl } : null);
    } catch (error) {
      console.error('Avatar upload error:', error);
      alert('Ошибка при загрузке аватара');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!confirm('Удалить аватар?')) return;

    try {
      const res = await fetch('/api/user/avatar', {
        method: 'DELETE',
      });

      if (!res.ok) {
        alert('Ошибка при удалении аватара');
        return;
      }

      setUser(prev => prev ? { ...prev, avatar_url: undefined } : null);
    } catch (error) {
      console.error('Avatar delete error:', error);
      alert('Ошибка при удалении аватара');
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPaymentError('');
    setPaymentSuccess(false);
    setSavingPayment(true);

    const formData = new FormData(e.currentTarget);
    const cardNumber = (formData.get('cardNumber') as string).replace(/\s/g, '');
    const cardHolder = formData.get('cardHolder') as string;
    const cardExpiry = formData.get('cardExpiry') as string;

    // Validation
    if (cardNumber.length !== 16) {
      setPaymentError('Неверный номер карты');
      setSavingPayment(false);
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      setPaymentError('Неверный формат срока действия (MM/YY)');
      setSavingPayment(false);
      return;
    }

    try {
      const res = await fetch('/api/user/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardNumber, cardHolder, cardExpiry }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPaymentError(data.error || 'Ошибка при сохранении');
        return;
      }

      setPaymentSuccess(true);
      setUser(prev => prev ? { 
        ...prev, 
        card_number: data.cardNumber,
        card_holder: cardHolder.toUpperCase(),
        card_expiry: cardExpiry
      } : null);

      setTimeout(() => setPaymentSuccess(false), 3000);
    } catch (error) {
      setPaymentError('Ошибка соединения с сервером');
    } finally {
      setSavingPayment(false);
    }
  };

  const handleRemovePayment = async () => {
    if (!confirm('Удалить платежные данные?')) return;

    try {
      const res = await fetch('/api/user/payment', {
        method: 'DELETE',
      });

      if (!res.ok) {
        alert('Ошибка при удалении');
        return;
      }

      setUser(prev => prev ? { 
        ...prev, 
        card_number: undefined,
        card_holder: undefined,
        card_expiry: undefined
      } : null);
    } catch (error) {
      alert('Ошибка при удалении');
    }
  };

  const formatCardInput = (value: string) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiryInput = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}></div>
            <p>Загрузка...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'profile', label: 'Профиль', icon: User },
    { id: 'orders', label: 'Заказы', icon: Calendar },
    { id: 'stats', label: 'Статистика', icon: TrendingUp },
    { id: 'payment', label: 'Оплата', icon: CreditCard },
  ];

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <motion.section
          className={styles.dashboardSection}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className={styles.dashboardHeader}>
            <div className={styles.headerLeft}>
              <div className={styles.avatarWrapper}>
                <div className={styles.avatar}>
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.name} className={styles.avatarImage} />
                  ) : (
                    <User size={32} />
                  )}
                </div>
                <label className={styles.avatarUpload}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={uploadingAvatar}
                    style={{ display: 'none' }}
                  />
                  <div className={styles.avatarUploadIcon}>
                    {uploadingAvatar ? '...' : '+'}
                  </div>
                </label>
                {user.avatar_url && (
                  <button
                    className={styles.avatarRemove}
                    onClick={handleRemoveAvatar}
                    title="Удалить аватар"
                  >
                    ×
                  </button>
                )}
              </div>
              <div>
                <h1 className={styles.userName}>{user.name}</h1>
                <p className={styles.userEmail}>{user.email}</p>
              </div>
            </div>
            <div className={styles.headerRight}>
              <button className={styles.iconButton}>
                <Bell size={20} />
              </button>
              <button onClick={handleLogout} className={styles.logoutButton}>
                <LogOut size={20} />
                Выйти
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            <motion.div 
              className={styles.statCard}
              whileHover={{ y: -4 }}
            >
              <div className={styles.statIcon}>
                <Calendar size={24} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{orders.filter(o => o.status === 'pending').length}</div>
                <div className={styles.statLabel}>Активных заказов</div>
              </div>
            </motion.div>

            <motion.div 
              className={styles.statCard}
              whileHover={{ y: -4 }}
            >
              <div className={styles.statIcon}>
                <TrendingUp size={24} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{orders.filter(o => o.status === 'completed').length}</div>
                <div className={styles.statLabel}>Завершенных</div>
              </div>
            </motion.div>

            <motion.div 
              className={styles.statCard}
              whileHover={{ y: -4 }}
            >
              <div className={styles.statIcon}>
                <CreditCard size={24} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>
                  {orders.reduce((sum, order) => sum + Number(order.price), 0)} ₽
                </div>
                <div className={styles.statLabel}>Потрачено</div>
              </div>
            </motion.div>

            <motion.div 
              className={styles.statCard}
              whileHover={{ y: -4 }}
            >
              <div className={styles.statIcon}>
                <Award size={24} />
              </div>
              <div className={styles.statContent}>
                <div className={styles.statValue}>{Math.floor(orders.reduce((sum, order) => sum + Number(order.price), 0) * 0.05)}</div>
                <div className={styles.statLabel}>Бонусов</div>
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className={styles.tabs}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className={styles.content}>
            {activeTab === 'profile' && (
              <motion.div
                className={styles.profileContent}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className={styles.contentGrid}>
                  <div className={styles.infoCard}>
                    <h3 className={styles.cardTitle}>Личная информация</h3>
                    <div className={styles.infoList}>
                      <div className={styles.infoItem}>
                        <div className={styles.infoIcon}>
                          <User size={20} />
                        </div>
                        <div className={styles.infoText}>
                          <div className={styles.infoLabel}>Имя</div>
                          <div className={styles.infoValue}>{user.name}</div>
                        </div>
                      </div>

                      <div className={styles.infoItem}>
                        <div className={styles.infoIcon}>
                          <Mail size={20} />
                        </div>
                        <div className={styles.infoText}>
                          <div className={styles.infoLabel}>Email</div>
                          <div className={styles.infoValue}>{user.email}</div>
                        </div>
                      </div>

                      {user.phone && (
                        <div className={styles.infoItem}>
                          <div className={styles.infoIcon}>
                            <Phone size={20} />
                          </div>
                          <div className={styles.infoText}>
                            <div className={styles.infoLabel}>Телефон</div>
                            <div className={styles.infoValue}>{user.phone}</div>
                          </div>
                        </div>
                      )}

                      <div className={styles.infoItem}>
                        <div className={styles.infoIcon}>
                          <Calendar size={20} />
                        </div>
                        <div className={styles.infoText}>
                          <div className={styles.infoLabel}>Дата регистрации</div>
                          <div className={styles.infoValue}>
                            {new Date(user.created_at).toLocaleDateString('ru-RU', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.activityCard}>
                    <h3 className={styles.cardTitle}>Последняя активность</h3>
                    {orders.length > 0 ? (
                      <div className={styles.activityList}>
                        {orders.slice(0, 3).map((order) => (
                          <div key={order.id} className={styles.activityItem}>
                            <div className={styles.activityIcon}>
                              <Calendar size={18} />
                            </div>
                            <div className={styles.activityContent}>
                              <div className={styles.activityTitle}>{order.service_name}</div>
                              <div className={styles.activityDate}>
                                {new Date(order.created_at).toLocaleDateString('ru-RU', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                            <div className={`${styles.activityStatus} ${styles[`status_${order.status}`]}`}>
                              {order.status === 'pending' && <Clock size={16} />}
                              {order.status === 'confirmed' && <CheckCircle size={16} />}
                              {order.status === 'completed' && <CheckCircle size={16} />}
                              {order.status === 'cancelled' && <XCircle size={16} />}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.emptyState}>
                        <Calendar size={48} strokeWidth={1.5} />
                        <h3>Пока нет активности</h3>
                        <p>Закажите первую услугу чтобы начать</p>
                        <a href="/services" className={styles.ctaLink}>
                          Заказать услугу
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                className={styles.ordersContent}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {orders.length > 0 ? (
                  <div className={styles.ordersList}>
                    {orders.map((order) => (
                      <div key={order.id} className={styles.orderCard}>
                        <div className={styles.orderHeader}>
                          <div>
                            <h4 className={styles.orderTitle}>{order.service_name}</h4>
                            <p className={styles.orderDate}>
                              {new Date(order.date).toLocaleDateString('ru-RU')} в {order.time}
                            </p>
                          </div>
                          <div className={`${styles.orderStatus} ${styles[`status_${order.status}`]}`}>
                            {order.status === 'pending' && 'В обработке'}
                            {order.status === 'confirmed' && 'Подтвержден'}
                            {order.status === 'completed' && 'Завершен'}
                            {order.status === 'cancelled' && 'Отменен'}
                          </div>
                        </div>
                        <div className={styles.orderDetails}>
                          <div className={styles.orderDetail}>
                            <span className={styles.detailLabel}>Адрес:</span>
                            <span className={styles.detailValue}>{order.address}</span>
                          </div>
                          <div className={styles.orderDetail}>
                            <span className={styles.detailLabel}>Стоимость:</span>
                            <span className={styles.detailValue}>{order.price} ₽</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <Calendar size={48} strokeWidth={1.5} />
                    <h3>У вас пока нет заказов</h3>
                    <p>Закажите первую услугу и она появится здесь</p>
                    <a href="/services" className={styles.ctaButton}>
                      Перейти к услугам
                    </a>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'stats' && (
              <motion.div
                className={styles.statsContent}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {orders.length > 0 ? (
                  <>
                    <div className={styles.statsGrid}>
                      <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                          <Calendar size={24} />
                        </div>
                        <div className={styles.statContent}>
                          <div className={styles.statValue}>{orders.length}</div>
                          <div className={styles.statLabel}>Всего заказов</div>
                        </div>
                      </div>

                      <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                          <TrendingUp size={24} />
                        </div>
                        <div className={styles.statContent}>
                          <div className={styles.statValue}>
                            {orders.reduce((sum, order) => sum + Number(order.price || 0), 0).toLocaleString('ru-RU')} ₽
                          </div>
                          <div className={styles.statLabel}>Общая сумма</div>
                        </div>
                      </div>

                      <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                          <CheckCircle size={24} />
                        </div>
                        <div className={styles.statContent}>
                          <div className={styles.statValue}>
                            {orders.filter(o => o.status === 'completed').length}
                          </div>
                          <div className={styles.statLabel}>Завершено</div>
                        </div>
                      </div>

                      <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                          <Clock size={24} />
                        </div>
                        <div className={styles.statContent}>
                          <div className={styles.statValue}>
                            {orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length}
                          </div>
                          <div className={styles.statLabel}>В процессе</div>
                        </div>
                      </div>
                    </div>

                    {/* Chart */}
                    <div className={styles.chartCard}>
                      <h3 className={styles.chartTitle}>Динамика заказов</h3>
                      <ResponsiveContainer width="100%" height={350}>
                        <AreaChart
                          data={(() => {
                            // Группируем заказы по дням
                            const groupedByDate = orders.reduce((acc: Record<string, { name: string; price: number; count: number }>, order) => {
                              const date = new Date(order.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
                              if (!acc[date]) {
                                acc[date] = { name: date, price: 0, count: 0 };
                              }
                              acc[date].price += Number(order.price || 0);
                              acc[date].count += 1;
                              return acc;
                            }, {});
                            
                            // Преобразуем в массив и берем последние 10 дней
                            return Object.values(groupedByDate).slice(-10);
                          })()}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0a0a0a" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#0a0a0a" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="0" stroke="#e0e0e0" vertical={false} />
                          <XAxis 
                            dataKey="name" 
                            stroke="#999"
                            tick={{ fill: '#666', fontSize: 12 }}
                            axisLine={{ stroke: '#e0e0e0', strokeWidth: 2 }}
                            tickLine={false}
                          />
                          <YAxis 
                            stroke="#999"
                            tick={{ fill: '#666', fontSize: 12 }}
                            axisLine={{ stroke: '#e0e0e0', strokeWidth: 2 }}
                            tickLine={false}
                            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                          />
                          <Tooltip 
                            contentStyle={{
                              background: 'white',
                              border: '2px solid #e0e0e0',
                              borderRadius: 0,
                              padding: '1rem',
                              boxShadow: 'none'
                            }}
                            labelStyle={{ 
                              color: '#0a0a0a', 
                              fontWeight: 500, 
                              marginBottom: '0.5rem',
                              fontSize: '0.9rem'
                            }}
                            itemStyle={{
                              color: '#666',
                              fontSize: '0.85rem'
                            }}
                            formatter={(value: number | undefined) => {
                              if (value === undefined) return ['', ''];
                              return [`${Number(value).toLocaleString('ru-RU')} ₽`, ''];
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="price" 
                            stroke="#0a0a0a" 
                            strokeWidth={2}
                            fill="url(#colorPrice)"
                            dot={{ 
                              fill: '#0a0a0a', 
                              strokeWidth: 2, 
                              r: 4,
                              stroke: '#fafafa'
                            }}
                            activeDot={{ 
                              r: 6, 
                              fill: '#0a0a0a',
                              stroke: '#fafafa',
                              strokeWidth: 3
                            }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                ) : (
                  <div className={styles.emptyState}>
                    <TrendingUp size={48} strokeWidth={1.5} />
                    <h3>Статистика пока недоступна</h3>
                    <p>Сделайте первый заказ чтобы увидеть статистику</p>
                    <a href="/services" className={styles.ctaLink}>
                      Заказать услугу
                    </a>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'payment' && (
              <motion.div
                className={styles.paymentContent}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className={styles.paymentCard}>
                  <h3 className={styles.cardTitle}>Платежные данные</h3>
                  
                  {user.card_number ? (
                    <div className={styles.savedCard}>
                      <div className={styles.cardDisplay}>
                        <div className={styles.cardBrand}>
                          <CreditCard size={32} />
                        </div>
                        <div className={styles.cardInfo}>
                          <div className={styles.cardNumberDisplay}>{user.card_number}</div>
                          <div className={styles.cardDetails}>
                            <span>{user.card_holder}</span>
                            <span>{user.card_expiry}</span>
                          </div>
                        </div>
                        <div className={styles.cardLogo}>PURE</div>
                      </div>
                      <button onClick={handleRemovePayment} className={styles.removeButton}>
                        Удалить карту
                      </button>
                    </div>
                  ) : (
                    <>
                      {paymentError && <div className={styles.errorMessage}>{paymentError}</div>}
                      {paymentSuccess && <div className={styles.successMessage}>Карта успешно добавлена!</div>}
                      
                      <form className={styles.paymentForm} onSubmit={handlePaymentSubmit}>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Номер карты *</label>
                          <input
                            type="text"
                            name="cardNumber"
                            className={styles.formInput}
                            placeholder="0000 0000 0000 0000"
                            maxLength={19}
                            required
                            onChange={(e) => {
                              e.target.value = formatCardInput(e.target.value);
                            }}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Срок действия *</label>
                          <input
                            type="text"
                            name="cardExpiry"
                            className={styles.formInput}
                            placeholder="MM/YY"
                            maxLength={5}
                            required
                            onChange={(e) => {
                              e.target.value = formatExpiryInput(e.target.value);
                            }}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>CVV *</label>
                          <input
                            type="password"
                            name="cvv"
                            className={styles.formInput}
                            placeholder="123"
                            maxLength={3}
                            required
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Имя на карте *</label>
                          <input
                            type="text"
                            name="cardHolder"
                            className={styles.formInput}
                            placeholder="IVAN IVANOV"
                            required
                            style={{ textTransform: 'uppercase' }}
                          />
                        </div>

                        <button type="submit" className={styles.saveButton} disabled={savingPayment}>
                          {savingPayment ? 'Сохранение...' : 'Сохранить карту'}
                        </button>
                      </form>
                    </>
                  )}

                  <div className={styles.paymentInfo}>
                    <p className={styles.infoText}>
                      <CreditCard size={16} />
                      Ваши платежные данные надежно защищены и зашифрованы
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
