import { Link } from 'react-router-dom';
import { APP_NAME, NAV_LINKS } from '../../constants/appConfig';
import styles from './Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.section}>
          <h3 className={styles.brandTitle}>{APP_NAME}</h3>
          <p className={styles.softText}>Tu aplicacion de musica favorita.</p>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Enlaces</h4>
          <nav className={styles.links}>
            {NAV_LINKS.map((item) => (
              <Link key={item.to} to={item.to} className={styles.navLink}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Equipo</h4>
          <ul className={styles.teamList}>
            <li>Gaston Berhau</li>
            <li>Fabrizio Brollo</li>
            <li>Valentin Bustamante</li>
            <li>Lucas Ortiz</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Contacto</h4>
          <p className={styles.softText}>info@snortify.com</p>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.copyright}>© 2026 {APP_NAME} - Todos los derechos reservados</p>
      </div>
    </footer>
  );
}

export default Footer;