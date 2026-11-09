import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerLogo}>PURE</div>
        <div className={styles.footerText}>
          © 2026 Pure Cleaning. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
