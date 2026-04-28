import { Link } from 'react-router-dom';
import { useState } from 'react';

function Header() {
  const [language, setLanguage] = useState('es');

  return (
    <header className="bg-linear-to-r from-green-500 to-gray-900 sticky top-0 z-100 shadow-lg px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 no-underline text-white text-2xl font-bold">
          <span className="text-3xl">🎵</span>
          <span className="text-white font-bold text-2xl">
            Sñotify
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {/* Selector de Idioma */}
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white/10 text-white border-none rounded-full px-3 py-1 cursor-pointer text-sm font-medium outline-none"
          >
            <option value="es" className="text-black">🇪🇸 ES</option>
            <option value="en" className="text-black">🇬🇧 EN</option>
          </select>

          <Link 
            to="/" 
            className="text-white/80 no-underline font-medium px-4 py-2 rounded-full transition-all duration-300 hover:text-white hover:bg-white/10"
          >
            Inicio
          </Link>
          <Link 
            to="/favorites" 
            className="text-white/80 no-underline font-medium px-4 py-2 rounded-full transition-all duration-300 hover:text-white hover:bg-white/10"
          >
            Favoritos
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;