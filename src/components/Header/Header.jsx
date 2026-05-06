import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { APP_NAME, NAV_LINKS } from '../../constants/appConfig';
import styles from './Header.module.css';

function Header() {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem('snortify_language', lang);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandIcon}>◉</span>
          <span>{APP_NAME}</span>
        </Link>

        <div className={styles.navWrapper}>
          <select
            value={i18n.language}
            onChange={handleLanguageChange}
            className={styles.languageSelect}
          >
            <option value="es" className="text-black">ES</option>
            <option value="en" className="text-black">EN</option>
          </select>

          {NAV_LINKS.map((item) => (
            <Link key={item.to} to={item.to} className={styles.navLink}>
              {item.key ? t(item.key) : item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Header;