import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/songs';
import { exportSongToPDF } from '../utils/exportPDF';

function Details() {
  const { id } = useParams();
  
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getSongById(id);
        setSong(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-75 text-white/60">
        <div className="w-12 h-12 border-4 border-white/10 border-t-green-500 rounded-full animate-spin mb-4"></div>
        <p>Cargando detalles...</p>
      </div>
    );
  }

  if (error || !song) {
    return (
      <div className="flex flex-col items-center justify-center min-h-75 text-white/60">
        <p>Error al cargar los detalles</p>
        <Link to="/" className="text-green-500 no-underline mt-4 hover:underline">← Volver</Link>
      </div>
    );
  }

  return (
    <div className="py-4">
      <Link to="/" className="text-white/70 no-underline mb-8 inline-block hover:text-green-500 transition-colors">← Volver</Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Imagen */}
        <div className="relative aspect-square rounded-xl overflow-hidden shadow-2xl">
          <img 
            src={song.image} 
            alt={song.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Info */}
        <div className="py-4">
          <h1 className="text-4xl font-bold mb-2 text-white">{song.name}</h1>
          <p className="text-2xl text-white/70 mb-8">{song.artist}</p>
          
          <div className="flex flex-col gap-3 mb-8">
            {song.album && (
              <div className="flex gap-2">
                <span className="text-white/50">Álbum:</span>
                <span className="text-white/90">{song.album}</span>
              </div>
            )}
            {song.duration && (
              <div className="flex gap-2">
                <span className="text-white/50">Duración:</span>
                <span className="text-white/90">{song.duration}</span>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button 
              className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:bg-green-400 hover:scale-105 cursor-pointer border-none"
              onClick={() => exportSongToPDF(song)}
            >
              📄 Exportar PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;