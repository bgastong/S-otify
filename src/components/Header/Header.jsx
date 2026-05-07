import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { APP_NAME, NAV_LINKS } from '../../constants/appConfig';
import styles from './Header.module.css';

function Header() {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Cerrar menú cuando la pantalla pasa a desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('snortify_language', lang);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandIcon}>◉</span>
          <span className={styles.brandText}>{APP_NAME}</span>
        </Link>

        {/* Botón hamburger para mobile */}
        <button 
          className={styles.menuToggle} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerOpen : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        {/* Nav wrapper - se muestra/oculta según mobile */}
        <div className={`${styles.navWrapper} ${isMenuOpen ? styles.navOpen : ''}`}>
          <select
            value={i18n.language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className={styles.languageSelect}
          >
            <option value="es" className="text-black">ES</option>
            <option value="en" className="text-black">EN</option>
          </select>

          {NAV_LINKS.map((item) => (
            <Link 
              key={item.to} 
              to={item.to} 
              className={styles.navLink}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.key ? t(item.key) : item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Header;