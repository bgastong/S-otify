import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NAV_LINKS } from '../../constants/appConfig';

function Header() {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsMenuOpen(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('snortify_language', lang);
  };

  return (
    <header 
      className={`
        fixed top-0 left-0 right-0 z-50 flex justify-center p-4 
        transition-all duration-500 ease-in-out
        ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
      `}
    >
      <nav className="
        w-full max-w-7xl flex items-center justify-between
        h-20 px-8 bg-[#09090B]/90 backdrop-blur-md
        border border-[#09090B]/90 rounded-full shadow-2xl
      ">
        {/*Logo */}
        <Link to="/" className="flex items-center gap-2 group flex-1">
          <div className="w-8 h-8 flex items-center justify-center">
            <img src="/logo (2).png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-lg font-black italic tracking-tighter text-white uppercase">
            Sñotify
          </span>
        </Link>

        {/*Links */}
        <div className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((item) => (
            <Link 
              key={item.to} 
              to={item.to} 
              className="text-sm font-semibold text-gray-300 hover:text-green-600 transition-colors"
            >
              {item.key ? t(item.key) : item.label}
            </Link>
          ))}
        </div>

        {/*Idioma */}
        <div className="hidden md:flex flex-1 justify-end items-center">
          <div className="flex gap-3 text-xs font-black bg- px-4 py-2 rounded-full border border-emerald-950">
            <button 
              onClick={() => handleLanguageChange('es')} 
              className={i18n.language === 'es' ? 'text-green-600' : 'text-gray-500'}
            >
              ES
            </button>
            <span className="text-gray-700">|</span>
            <button 
              onClick={() => handleLanguageChange('en')} 
              className={i18n.language === 'en' ? 'text-green-600' : 'text-gray-500'}
            >
              EN
            </button>
          </div>
        </div>

        {/* Movil */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2">
            <div className="w-6 h-5 flex flex-col justify-between items-end">
              <span className={`h-0.5 bg-white rounded-full transition-all ${isMenuOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`}></span>
              <span className={`h-0.5 bg-white rounded-full transition-all ${isMenuOpen ? 'opacity-0' : 'w-4'}`}></span>
              <span className={`h-0.5 bg-white rounded-full transition-all ${isMenuOpen ? 'w-6 -rotate-45 -translate-y-2.5' : 'w-5'}`}></span>
            </div>
          </button>
        </div>
      </nav>

      {/* Menu Móvil */}
      <div className={`
        absolute top-full left-4 right-4 mt-2 p-6
        bg-[#09090B] border border-gray-800 rounded-3xl
        flex flex-col gap-6 text-center transition-all duration-300
        ${isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
        md:hidden
      `}>
        {NAV_LINKS.map((item) => (
          <Link key={item.to} to={item.to} className="text-lg text-gray-200" onClick={() => setIsMenuOpen(false)}>
            {item.key ? t(item.key) : item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}

export default Header;