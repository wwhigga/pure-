'use client';

import { motion } from 'framer-motion';
import { Sparkles, Shield, Clock, Award, ArrowRight, Phone, Mail } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export default function Home() {
  const services = [
    { icon: Sparkles, title: 'Генеральная уборка', desc: 'Комплексная уборка всех помещений' },
    { icon: Shield, title: 'Дезинфекция', desc: 'Профессиональная обработка поверхностей' },
    { icon: Clock, title: 'Регулярный клининг', desc: 'Поддерживающая уборка по графику' },
    { icon: Award, title: 'Премиум сервис', desc: 'Индивидуальный подход к каждому клиенту' },
  ];

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <section className={styles.hero}>
          <motion.div 
            className={styles.heroContent}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className={styles.heroTitle}>
              Чистота —<br />это искусство
            </h1>
            <p className={styles.heroSubtitle}>
              Профессиональный клининг для тех,<br />кто ценит безупречность
            </p>
            <motion.a 
              href="/services"
              className={styles.ctaButton}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Заказать уборку
              <ArrowRight size={20} />
            </motion.a>
          </motion.div>
          
          <motion.div 
            className={styles.heroVisual}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className={styles.visualGrid}>
              <div className={styles.gridItem}>
                <Sparkles size={40} strokeWidth={1.5} />
              </div>
              <div className={`${styles.gridItem} ${styles.tallItem}`}>
                <div className={styles.statBox}>
                  <div className={styles.statNum}>98%</div>
                </div>
              </div>
              <div className={`${styles.gridItem} ${styles.wideItem}`}>
                <div className={styles.textBox}>PURE</div>
              </div>
              <div className={styles.gridItem}>
                <Shield size={40} strokeWidth={1.5} />
              </div>
              <div className={styles.gridItem}>
                <Clock size={40} strokeWidth={1.5} />
              </div>
            </div>
          </motion.div>
        </section>

        <section className={styles.services} id="services">
          <motion.h2 
            className={styles.sectionTitle}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Наши услуги
          </motion.h2>
          
          <div className={styles.servicesGrid}>
            {services.map((service, index) => (
              <motion.div
                key={index}
                className={styles.serviceCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className={styles.serviceIcon}>
                  <service.icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDesc}>{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className={styles.stats}>
          <motion.div 
            className={styles.statsContainer}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className={styles.statItem}>
              <div className={styles.statValue}>5000+</div>
              <div className={styles.statText}>Выполненных заказов</div>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>24/7</div>
              <div className={styles.statText}>Поддержка клиентов</div>
            </div>
            <div className={styles.statDivider}></div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>8 лет</div>
              <div className={styles.statText}>На рынке</div>
            </div>
          </motion.div>
        </section>

        <section className={styles.cta} id="contact">
          <motion.div 
            className={styles.ctaContent}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.ctaTitle}>Готовы к переменам?</h2>
            <p className={styles.ctaText}>
              Оставьте заявку и получите бесплатную консультацию
            </p>
            <div className={styles.contactButtons}>
              <motion.a 
                href="tel:+79999999999" 
                className={styles.contactButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone size={20} />
                +7 (999) 999-99-99
              </motion.a>
              <motion.a 
                href="mailto:info@pure.ru" 
                className={styles.contactButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail size={20} />
                info@pure.ru
              </motion.a>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
