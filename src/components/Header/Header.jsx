import { useState, useEffect, useId, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { songsService } from '../../services/songsService';
import { NAV_LINKS } from '../../constants/appConfig';

function Header({ searchTerm = "", onSearchChange, onFilterChange, currentGenre = "" }) {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [genres, setGenres] = useState([]);
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);
  const genreDropdownRef = useRef(null);
  const searchInputId = useId();

  // Click outside para cerrar dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (genreDropdownRef.current && !genreDropdownRef.current.contains(event.target)) {
        setGenreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const songs = await songsService.getSongs({ page: 1, limit: 100 });
        const uniqueGenres = [...new Set(songs.map((s) => s.genre).filter(Boolean))].sort();
        setGenres(uniqueGenres);
      } catch {
        setGenres([]);
      }
    };
    fetchGenres();
  }, []);

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
        fixed top-0 left-0 right-0 z-50 flex justify-center p-3 
        transition-all duration-300 ease-out
        ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}
      `}
    >
      <nav className="
        w-full max-w-6xl flex items-center justify-between gap-3
        h-16 px-4 md:px-5 bg-gradient-to-b from-[#181818]/95 to-[#0a0a0a]/90
        border border-white/5 rounded-2xl backdrop-blur-md
        shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6),0_0_30px_-10px_rgba(30,215,96,0.08)]
      ">
        {/* Logo - siempre a la izquierda */}
        <Link to="/" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 flex items-center justify-center">
            <img src="/logo (2).png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white/90 uppercase">
            Sñotify
          </span>
        </Link>

        {/* Botón hamburger - solo mobile, a la derecha */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="md:hidden text-white/80 p-2 -mr-1 hover:text-white transition-colors ml-auto"
        >
          <div className="w-6 h-5 flex flex-col justify-between items-end">
            <span className={`h-0.5 bg-white/80 rounded-full transition-all ${isMenuOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`}></span>
            <span className={`h-0.5 bg-white/80 rounded-full transition-all ${isMenuOpen ? 'opacity-0' : 'w-4'}`}></span>
            <span className={`h-0.5 bg-white/80 rounded-full transition-all ${isMenuOpen ? 'w-6 -rotate-45 -translate-y-2.5' : 'w-5'}`}></span>
          </div>
        </button>

        {/*Links */}
        <div className="hidden md:flex items-center gap-1.5">
          <Link 
            to="/" 
            className={`p-2 rounded-lg transition-all ${
              location.pathname === '/' 
                ? 'text-green-500' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title={t('nav.home')}
          >
            {location.pathname === '/' ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
            )}
          </Link>
          <Link 
            to="/favorites" 
            className={`p-2 rounded-lg transition-all ${
              location.pathname === '/favorites' 
                ? 'text-green-500' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title={t('nav.favorites')}
          >
            {location.pathname === '/favorites' ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
            )}
          </Link>
        </div>

        {/* Desktop: Links + Search (wrapper central, antes del idioma) */}
        <div className="hidden md:flex flex-1 items-center gap-2 ml-4 max-w-md">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              id={searchInputId}
              type="search"
              value={searchTerm}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={t('home.searchPlaceholder')}
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-white/5 border border-white/10 rounded-lg text-zinc-200 placeholder:text-zinc-500/70 hover:bg-white/10 hover:border-white/20 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-all"
            />
          </div>
          
          {genres.length > 0 && (
            <div className="relative" ref={genreDropdownRef}>
              {/* Botón trigger */}
              <button
                onClick={() => setGenreDropdownOpen(!genreDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-white/5 border border-white/10 rounded-lg text-zinc-300 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
              >
                <span className="max-w-[80px] truncate">
                  {currentGenre || t('home.filterAllGenres')}
                </span>
                <svg 
                  className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${genreDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown menu */}
              {genreDropdownOpen && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-[#181818]/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl shadow-black/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150 max-h-64 overflow-y-auto">
                  {/* Opción "Todos" */}
                  <button
                    onClick={() => { onFilterChange?.(''); setGenreDropdownOpen(false); }}
                    className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                      !currentGenre 
                        ? 'text-green-400 bg-green-500/10' 
                        : 'text-zinc-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {t('home.filterAllGenres')}
                  </button>
                  {/* Opciones por género */}
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => { onFilterChange?.(genre); setGenreDropdownOpen(false); }}
                      className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                        currentGenre === genre 
                          ? 'text-green-400 bg-green-500/10' 
                          : 'text-zinc-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Idioma - a la derecha */}
        <div className="hidden md:flex items-center ml-auto">
          <div className="relative flex items-center px-1 py-1.5 bg-white/5 rounded-lg border border-white/10 min-w-[80px]">
            <div 
              className="absolute bottom-0 h-0.5 bg-green-500 rounded-t-sm transition-[left] duration-150 ease-out"
              style={{
                width: '32px',
                left: i18n.language === 'es' ? '4px' : '44px'
              }}
            />
            <button 
              onClick={() => handleLanguageChange('es')} 
              className={`flex-1 text-center text-lg transition-all ${
                i18n.language === 'es' 
                  ? 'text-green-400' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Español"
            >
              🇪🇸
            </button>
            <button 
              onClick={() => handleLanguageChange('en')} 
              className={`flex-1 text-center text-lg transition-all ${
                i18n.language === 'en' 
                  ? 'text-green-400' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="English"
            >
              🇬🇧
            </button>
          </div>
        </div>
      </nav>

      {/* Menu Móvil */}
      <div className={`
        absolute top-full left-2 right-2 mt-2 p-4
        bg-[#181818]/95 backdrop-blur-xl border border-white/10 rounded-2xl
        flex flex-col gap-4 transition-all duration-300
        shadow-2xl shadow-black/50
        ${isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
        md:hidden
      `}>
        {/* Search - arriba */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={t('home.searchPlaceholder')}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-zinc-200 placeholder:text-zinc-500/70 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20"
          />
        </div>

        {/* Links e idioma en la misma fila */}
        <div className="flex items-center justify-between">
          {/* Links: Home y Favoritos */}
          <div className="flex gap-2">
            <Link 
              to="/" 
              className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                location.pathname === '/' 
                  ? 'text-green-500' 
                  : 'text-zinc-400 hover:text-white'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {location.pathname === '/' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  <polyline points="9,22 9,12 15,12 15,22"/>
                </svg>
              )}
              <span className="text-sm">{t('nav.home')}</span>
            </Link>
            <Link 
              to="/favorites" 
              className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                location.pathname === '/favorites' 
                  ? 'text-green-500' 
                  : 'text-zinc-400 hover:text-white'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {location.pathname === '/favorites' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              )}
              <span className="text-sm">{t('nav.favorites')}</span>
            </Link>
          </div>

          {/* Idioma - a la derecha */}
          <div className="relative flex items-center px-1 py-1 bg-white/5 rounded-lg border border-white/10 min-w-[70px]">
            {/* Indicador móvil */}
            <div 
              className="absolute bottom-0 h-0.5 bg-green-500 rounded-t-sm transition-[left] duration-150 ease-out"
              style={{
                width: '28px',
                left: i18n.language === 'es' ? '3px' : '39px'
              }}
            />
            <button 
              onClick={() => handleLanguageChange('es')} 
              className={`flex-1 text-center text-base py-1 transition-all ${
                i18n.language === 'es' 
                  ? 'text-green-400' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              🇪🇸
            </button>
            <button 
              onClick={() => handleLanguageChange('en')} 
              className={`flex-1 text-center text-base py-1 transition-all ${
                i18n.language === 'en' 
                  ? 'text-green-400' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              🇬🇧
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;