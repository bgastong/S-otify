import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { APP_NAME, NAV_LINKS } from '../../constants/appConfig';
import styles from './Footer.module.css';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.section}>
          <h3 className={styles.brandTitle}>{APP_NAME}</h3>
          <p className={styles.softText}>{t('footer.brandSubtitle')}</p>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>{t('footer.linksTitle')}</h4>
          <nav className={styles.links}>
            {NAV_LINKS.map((item) => (
              <Link key={item.to} to={item.to} className={styles.navLink}>
                {item.key ? t(item.key) : item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>{t('footer.teamTitle')}</h4>
          <ul className={styles.teamList}>
            <li>Gastón Berhau</li>
            <li>Fabrizio Brollo</li>
            <li>Valentín Bustamante</li>
            <li>Lucas Ortiz</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>{t('footer.contactTitle')}</h4>
          <p className={styles.softText}>{t('footer.contactEmail')}</p>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.copyright}>{t('footer.copyright', { appName: APP_NAME })}</p>
      </div>
    </footer>
  );
}

export default Footer;