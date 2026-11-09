'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Sparkles, Shield, Clock, Award, Home, Building2, Droplets, Wind, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './services.module.css';

export default function Services() {
  const router = useRouter();
  
  const services = [
    {
      id: 'general',
      icon: Sparkles,
      title: 'Генеральная уборка',
      price: 'от 3 500 ₽',
      features: [
        'Влажная уборка всех поверхностей',
        'Мытье окон и зеркал',
        'Уборка санузлов',
        'Чистка бытовой техники',
        'Уборка труднодоступных мест'
      ]
    },
    {
      id: 'disinfection',
      icon: Shield,
      title: 'Дезинфекция',
      price: 'от 2 500 ₽',
      features: [
        'Обработка всех поверхностей',
        'Антибактериальная обработка',
        'Безопасные средства',
        'Сертифицированные препараты',
        'Гарантия качества'
      ]
    },
    {
      id: 'regular',
      icon: Clock,
      title: 'Регулярный клининг',
      price: 'от 2 000 ₽',
      features: [
        'Поддерживающая уборка',
        'Гибкий график',
        'Скидки при абонементе',
        'Постоянная команда',
        'Индивидуальный подход'
      ]
    },
    {
      id: 'apartment',
      icon: Home,
      title: 'Уборка квартир',
      price: 'от 2 500 ₽',
      features: [
        'Все типы помещений',
        'Экологичные средства',
        'Профессиональное оборудование',
        'Быстрое выполнение',
        'Гарантия результата'
      ]
    },
    {
      id: 'office',
      icon: Building2,
      title: 'Уборка офисов',
      price: 'от 5 000 ₽',
      features: [
        'Коммерческие помещения',
        'Работа в нерабочее время',
        'Комплексное обслуживание',
        'Договор на обслуживание',
        'Отчетность по работам'
      ]
    },
    {
      id: 'furniture',
      icon: Droplets,
      title: 'Химчистка мебели',
      price: 'от 1 500 ₽',
      features: [
        'Диваны и кресла',
        'Матрасы',
        'Ковры и ковровые покрытия',
        'Удаление пятен',
        'Устранение запахов'
      ]
    },
    {
      id: 'windows',
      icon: Wind,
      title: 'Мойка окон',
      price: 'от 800 ₽',
      features: [
        'Внутренняя и наружная мойка',
        'Любая этажность',
        'Мытье рам и подоконников',
        'Без разводов',
        'Безопасная работа'
      ]
    },
    {
      id: 'premium',
      icon: Award,
      title: 'Премиум сервис',
      price: 'от 10 000 ₽',
      features: [
        'VIP-обслуживание',
        'Персональный менеджер',
        'Эксклюзивные средства',
        'Максимальное качество',
        'Приоритетное обслуживание'
      ]
    }
  ];

  const handleServiceOrder = (serviceId: string) => {
    router.push(`/order?service=${serviceId}`);
  };

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroBackground}>
            <div className={styles.bgText} style={{ top: '5%', left: '2%', transform: 'rotate(-12deg)' }}>PURE</div>
            <div className={styles.bgText} style={{ top: '10%', right: '5%', transform: 'rotate(15deg)' }}>PURE</div>
            <div className={styles.bgText} style={{ bottom: '5%', left: '8%', transform: 'rotate(-8deg)' }}>PURE</div>
            <div className={styles.bgText} style={{ bottom: '10%', right: '3%', transform: 'rotate(10deg)' }}>PURE</div>
          </div>
          <motion.div
            className={styles.heroContent}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className={styles.heroTitle}>Наши услуги</h1>
            <p className={styles.heroSubtitle}>
              Профессиональный клининг для любых задач.<br />
              Выберите подходящий вариант для вас.
            </p>
          </motion.div>
        </section>

        <section className={styles.servicesSection}>
          <div className={styles.servicesGrid}>
            {services.map((service, index) => (
              <motion.div
                key={index}
                className={styles.serviceCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.serviceIcon}>
                    <service.icon size={32} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className={styles.serviceTitle}>{service.title}</h3>
                    <div className={styles.servicePrice}>{service.price}</div>
                  </div>
                </div>
                <ul className={styles.featuresList}>
                  {service.features.map((feature, idx) => (
                    <li key={idx} className={styles.featureItem}>
                      <CheckCircle size={16} strokeWidth={2} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  className={styles.orderButton}
                  onClick={() => handleServiceOrder(service.id)}
                >
                  Заказать
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        <section className={styles.cta}>
          <motion.div
            className={styles.ctaContent}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.ctaTitle}>Не нашли нужную услугу?</h2>
            <p className={styles.ctaText}>
              Свяжитесь с нами, и мы подберем индивидуальное решение
            </p>
            <a href="tel:+78005553535" className={styles.ctaButton}>
              +7 (800) 555-35-35
            </a>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
