'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Sparkles, Shield, Clock, Award, Home, Building2, Droplets, Wind, User, XCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './order.module.css';

const services = [
  { id: 'general', icon: Sparkles, name: 'Генеральная уборка', price: 3500, desc: 'Комплексная уборка всех помещений с использованием профессионального оборудования', features: ['Влажная уборка всех поверхностей', 'Мытье окон и зеркал', 'Уборка санузлов', 'Чистка бытовой техники', 'Уборка труднодоступных мест'] },
  { id: 'disinfection', icon: Shield, name: 'Дезинфекция', price: 2500, desc: 'Профессиональная обработка всех поверхностей антибактериальными средствами', features: ['Обработка всех поверхностей', 'Антибактериальная обработка', 'Безопасные средства', 'Сертифицированные препараты', 'Гарантия качества'] },
  { id: 'regular', icon: Clock, name: 'Регулярный клининг', price: 2000, desc: 'Поддерживающая уборка по индивидуальному графику', features: ['Поддерживающая уборка', 'Гибкий график', 'Скидки при абонементе', 'Постоянная команда', 'Индивидуальный подход'] },
  { id: 'apartment', icon: Home, name: 'Уборка квартир', price: 2500, desc: 'Профессиональная уборка квартир любой площади', features: ['Все типы помещений', 'Экологичные средства', 'Профессиональное оборудование', 'Быстрое выполнение', 'Гарантия результата'] },
  { id: 'office', icon: Building2, name: 'Уборка офисов', price: 5000, desc: 'Комплексное обслуживание коммерческих помещений', features: ['Коммерческие помещения', 'Работа в нерабочее время', 'Комплексное обслуживание', 'Договор на обслуживание', 'Отчетность по работам'] },
  { id: 'furniture', icon: Droplets, name: 'Химчистка мебели', price: 1500, desc: 'Профессиональная химчистка мягкой мебели и ковров', features: ['Диваны и кресла', 'Матрасы', 'Ковры и ковровые покрытия', 'Удаление пятен', 'Устранение запахов'] },
  { id: 'windows', icon: Wind, name: 'Мойка окон', price: 800, desc: 'Профессиональная мойка окон любой сложности', features: ['Внутренняя и наружная мойка', 'Любая этажность', 'Мытье рам и подоконников', 'Без разводов', 'Безопасная работа'] },
  { id: 'premium', icon: Award, name: 'Премиум сервис', price: 10000, desc: 'VIP-обслуживание с максимальным качеством', features: ['VIP-обслуживание', 'Персональный менеджер', 'Эксклюзивные средства', 'Максимальное качество', 'Приоритетное обслуживание'] }
];

interface UserData {
  id: number;
  name: string;
  email: string;
  phone?: string;
  card_number?: string;
}

function OrderPageContent() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('service');
  const service = services.find(s => s.id === serviceId);

  useEffect(() => {
    checkAuth();
  }, []);

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

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!user?.card_number) {
      setError('Необходимо добавить платежные данные перед оформлением заказа');
      setSubmitting(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const orderData = {
      serviceType: service?.id,
      serviceName: service?.name,
      price: service?.price,
      address: formData.get('address'),
      phone: formData.get('phone'),
      date: formData.get('date'),
      time: formData.get('time'),
      comment: formData.get('comment'),
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Ошибка при создании заказа');
        return;
      }

      setSuccess(true);
      setCurrentStep(3);
      setTimeout(() => {
        router.push('/dashboard?tab=orders');
      }, 3000);
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Загрузка...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <motion.div className={styles.centerCard} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className={styles.emptyIcon}><User size={64} strokeWidth={1} /></div>
            <h2 className={styles.centerTitle}>Требуется авторизация</h2>
            <p className={styles.centerText}>Для оформления заказа необходимо войти в систему</p>
            <a href="/profile" className={styles.primaryButton}>Войти</a>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <motion.div className={styles.centerCard} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className={styles.emptyIcon}><XCircle size={64} strokeWidth={1} /></div>
            <h2 className={styles.centerTitle}>Услуга не найдена</h2>
            <p className={styles.centerText}>Выбранная услуга не существует</p>
            <a href="/services" className={styles.primaryButton}>К услугам</a>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  const ServiceIcon = service.icon;

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <motion.section className={styles.orderSection} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className={styles.bgTextContainer}>
            <div className={styles.bgText} style={{ top: '5%', left: '2%', transform: 'rotate(-12deg)' }}>PURE</div>
            <div className={styles.bgText} style={{ top: '10%', right: '5%', transform: 'rotate(15deg)' }}>PURE</div>
            <div className={styles.bgText} style={{ bottom: '5%', left: '8%', transform: 'rotate(-8deg)' }}>PURE</div>
            <div className={styles.bgText} style={{ bottom: '10%', right: '3%', transform: 'rotate(10deg)' }}>PURE</div>
          </div>

          <button onClick={() => router.back()} className={styles.backButton}>
            <ArrowLeft size={20} />
            Назад
          </button>

          <div className={styles.stepsContainer}>
            <div className={styles.step}>
              <div className={`${styles.stepCircle} ${currentStep >= 1 ? styles.stepActive : ''}`}><ServiceIcon size={20} /></div>
              <span className={styles.stepLabel}>Услуга</span>
            </div>
            <div className={styles.stepLine}></div>
            <div className={styles.step}>
              <div className={`${styles.stepCircle} ${currentStep >= 2 ? styles.stepActive : ''}`}><CheckCircle size={20} /></div>
              <span className={styles.stepLabel}>Детали</span>
            </div>
            <div className={styles.stepLine}></div>
            <div className={styles.step}>
              <div className={`${styles.stepCircle} ${currentStep >= 3 ? styles.stepActive : ''}`}><Award size={20} /></div>
              <span className={styles.stepLabel}>Готово</span>
            </div>
          </div>

          {/* Step 1: Service Info */}
          {currentStep === 1 && (
            <motion.div 
              className={styles.stepContent}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <div className={styles.serviceDisplay}>
                <div className={styles.serviceHeader}>
                  <div className={styles.serviceBadgeLarge}>
                    <ServiceIcon size={80} strokeWidth={1.5} />
                  </div>
                  <h1 className={styles.serviceTitleLarge}>{service.name}</h1>
                  <p className={styles.serviceDescLarge}>{service.desc}</p>
                </div>

                <div className={styles.priceCard}>
                  <span className={styles.priceLabel}>Стоимость услуги</span>
                  <span className={styles.priceAmountLarge}>{service.price.toLocaleString('ru-RU')} ₽</span>
                </div>

                <div className={styles.divider}></div>

                <h3 className={styles.featuresHeading}>Что входит в услугу</h3>
                <ul className={styles.featuresListLarge}>
                  {service.features.map((feature, index) => (
                    <motion.li 
                      key={index} 
                      className={styles.featureItemLarge}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <div className={styles.featureIcon}>
                        <CheckCircle size={20} />
                      </div>
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <div className={styles.brandMarkLarge}>PURE</div>

                <button onClick={handleNextStep} className={styles.nextButton}>
                  Продолжить
                  <ArrowLeft size={20} style={{ transform: 'rotate(180deg)' }} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Order Form */}
          {currentStep === 2 && (
            <motion.div 
              className={styles.stepContent}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <div className={styles.formContainer}>
                <h2 className={styles.formHeading}>Детали заказа</h2>
                <p className={styles.formSubheading}>Заполните информацию для оформления заказа</p>

                {error && <motion.div className={styles.alert} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>{error}</motion.div>}

                <form onSubmit={handleSubmit} className={styles.orderForm}>
                  <div className={styles.formGrid}>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>Адрес *</label>
                      <input type="text" name="address" className={styles.inputField} placeholder="ул. Примерная, д. 1, кв. 1" required disabled={submitting} />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>Телефон *</label>
                      <input type="tel" name="phone" className={styles.inputField} placeholder="+7 (999) 999-99-99" defaultValue={user.phone || ''} required disabled={submitting} />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>Дата *</label>
                      <input type="date" name="date" className={styles.inputField} min={new Date().toISOString().split('T')[0]} required disabled={submitting} />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>Время *</label>
                      <select name="time" className={styles.inputField} required disabled={submitting}>
                        <option value="">Выберите</option>
                        {Array.from({ length: 10 }, (_, i) => i + 9).map(hour => (
                          <option key={hour} value={`${hour}:00`}>{hour}:00</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Комментарий</label>
                    <textarea name="comment" className={styles.textareaField} placeholder="Дополнительные пожелания..." rows={4} disabled={submitting} />
                  </div>

                  <div className={styles.orderSummary}>
                    <div className={styles.summaryRow}>
                      <span>Услуга:</span>
                      <strong>{service.name}</strong>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Стоимость:</span>
                      <strong>{service.price.toLocaleString('ru-RU')} ₽</strong>
                    </div>
                  </div>

                  <div className={styles.buttonGroup}>
                    <button type="button" onClick={handlePrevStep} className={styles.backButtonLarge} disabled={submitting}>
                      <ArrowLeft size={20} />
                      Назад
                    </button>
                    <button type="submit" className={styles.submitButton} disabled={submitting}>
                      {submitting ? (
                        <>
                          <div className={styles.buttonSpinner}></div>
                          Оформление...
                        </>
                      ) : (
                        <>
                          Оформить заказ
                          <CheckCircle size={20} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* Step 3: Success */}
          {currentStep === 3 && success && (
            <motion.div 
              className={styles.stepContent}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.successContainer}>
                <motion.div 
                  className={styles.successIcon}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                  <CheckCircle size={80} strokeWidth={1.5} />
                </motion.div>
                <h2 className={styles.successTitle}>Заказ успешно создан!</h2>
                <p className={styles.successText}>
                  Ваш заказ на услугу <strong>{service.name}</strong> принят в обработку.
                  <br />
                  Мы свяжемся с вами в ближайшее время.
                </p>
                <div className={styles.successDetails}>
                  <div className={styles.detailRow}>
                    <span>Номер заказа:</span>
                    <strong>#{Math.floor(Math.random() * 10000)}</strong>
                  </div>
                  <div className={styles.detailRow}>
                    <span>Стоимость:</span>
                    <strong>{service.price.toLocaleString('ru-RU')} ₽</strong>
                  </div>
                </div>
                <p className={styles.redirectText}>Перенаправление в личный кабинет...</p>
                <div className={styles.successBrand}>PURE</div>
              </div>
            </motion.div>
          )}
        </motion.section>
      </main>
      <Footer />
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Загрузка...</p>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <OrderPageContent />
    </Suspense>
  );
}
