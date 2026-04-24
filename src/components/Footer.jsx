import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto py-12 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sección 1: Logo */}
        <div className="flex flex-col gap-3">
          <h3 className="text-2xl font-bold text-green-500 m-0">Sñotify</h3>
          <p className="text-white/70 m-0 leading-relaxed">
            Tu aplicación de música favorita.
          </p>
        </div>

        {/* Sección 2: Enlaces */}
        <div className="flex flex-col gap-3">
          <h4 className="text-lg font-semibold m-0 text-white">Enlaces</h4>
          <nav className="flex flex-col gap-2">
            <Link to="/" className="text-white/70 no-underline transition-colors duration-300 hover:text-green-500">
              Inicio
            </Link>
            <Link to="/favorites" className="text-white/70 no-underline transition-colors duration-300 hover:text-green-500">
              Favoritos
            </Link>
          </nav>
        </div>

        {/* Sección 3: Equipo */}
        <div className="flex flex-col gap-3">
          <h4 className="text-lg font-semibold m-0 text-white">Equipo</h4>
          <ul className="list-none p-0 m-0 text-white/70 flex flex-col gap-1">
            <li>Gastón Berhau</li>
            <li>Fabrizio Brollo</li>
            <li>Valentín Bustamante</li>
            <li>Lucas Ortiz</li>
          </ul>
        </div>

        {/* Sección 4: Contacto */}
        <div className="flex flex-col gap-3">
          <h4 className="text-lg font-semibold m-0 text-white">Contacto</h4>
          <p className="text-white/70 m-0">info@snortify.com</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/10 text-center">
        <p className="text-white/50 text-sm m-0">© 2024 Sñotify - Todos los derechos reservados</p>
      </div>
    </footer>
  );
}

export default Footer;