import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { songsService } from "../../services/songsService";
import AsyncState from "../AsyncState/AsyncState";

function formatDuration(duration) {
  if (!duration) return '';
  
  // Si es número (segundos), convertir a mm:ss
  if (typeof duration === 'number') {
    const mins = Math.floor(duration / 60);
    const secs = Math.floor(duration % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  
  // Si ya tiene formato mm:ss, retornarlo
  if (typeof duration === 'string' && duration.includes(':')) return duration;
  
  // Parsear ISO 8601 (PT3M45S -> 3:45)
  if (typeof duration === 'string') {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return duration;
    
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  
  return '';
}

function SongDetails({ onSelectSong }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [calculatedDuration, setCalculatedDuration] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSongDetails = async () => {
      if (!id) {
        setSong(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await songsService.getSongById(id);
        if (isMounted && data) {
          setSong(data);
        } else if (isMounted && !data) {
          setError(t('details.notFound'));
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || t('details.errorMessage'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSongDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

// Cargar estado de favorito desde API
useEffect(() => {
  let isMounted = true;

  const fetchFavoriteState = async () => {
    if (!song?.id) return;

    try {
      const data = await songsService.isFavorite(song.id);

      if (isMounted) {
        setIsFavorite(Boolean(data?.isFavorite));
      }
    } catch {
      if (isMounted) {
        setIsFavorite(false);
      }
    }
  };

  fetchFavoriteState();

  return () => {
    isMounted = false;
  };
}, [song?.id]);

  // Obtener duración del audio
  useEffect(() => {
    if (!song?.audioUrl || !audioRef.current) return;
    
    audioRef.current.src = song.audioUrl;
    audioRef.current.load();
    
    const handleLoadedMetadata = () => {
      if (audioRef.current?.duration && isFinite(audioRef.current.duration)) {
        setCalculatedDuration(audioRef.current.duration);
      }
    };
    
    audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => {
      audioRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [song?.audioUrl]);

const handleAddToFavorites = async () => {
  if (!song) return;

  try {
    if (isFavorite) {
      await songsService.removeFavorite(song.id);
      setIsFavorite(false);
    } else {
      await songsService.addFavorite(song.id);
      setIsFavorite(true);
    }
  } catch (err) {
    setError(err.message || 'No pudimos actualizar favoritos.');
  }
};

  const handlePlay = () => {
    if (song && typeof onSelectSong === "function") {
      onSelectSong(song, { autoplay: true });
    }
  };

  return (
    <>
      <audio ref={audioRef} className="hidden" preload="metadata" />
      <section 
        className="min-h-screen py-8 px-4"
        style={{
          backgroundColor: '#000000',
          backgroundImage: `
            radial-gradient(circle at top left, rgba(10, 35, 10, 0.7) 0%, transparent 45%),
            radial-gradient(circle at top right, rgba(10, 35, 10, 0.7) 0%, transparent 45%),
            linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.95) 100%)
          `,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover'
        }}
      >
        <div className="max-w-5xl mx-auto pt-12 md:pt-16">
          {/* Botón volver fijo arriba a la izquierda */}
          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer absolute top-8 left-4 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 flex items-center gap-1 group z-10"
          >
            <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
          </button>

        <AsyncState
          loading={loading}
          error={error}
          isEmpty={!loading && !error && !song}
          loadingMessage={t('details.loadingMessage')}
          emptyMessage={t('details.notFound')}
          onRetry={() => window.location.reload()}
        />

        {song && (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 overflow-hidden backdrop-blur-sm shadow-2xl">
            {/* Header con imagen de fondo */}
            <div className="relative h-72 md:h-[28rem] overflow-hidden bg-gradient-to-br from-zinc-900 to-black">
              {!imageError && song.image ? (
                <img
                  src={song.image}
                  alt={song.name}
                  className="w-full h-full object-cover opacity-40"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-700 text-8xl">
                  ♪
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
            </div>

            {/* Contenido principal */}
            <div className="px-6 md:px-8 py-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Imagen de portada destacada */}
                <div className="flex-shrink-0">
                  <div className="w-full md:w-48 aspect-square rounded-xl overflow-hidden border border-white/10 shadow-2xl hover:shadow-green-500/20 hover:scale-[1.02] transition-all duration-300">
                    {!imageError && song.image ? (
                      <img
                        src={song.image}
                        alt={song.name}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-600 text-5xl">
                        ♪
                      </div>
                    )}
                  </div>
                </div>

                {/* Información de la canción */}
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">
                    {t('details.songType')}
                  </p>
                  <h1 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight">
                    {song.name}
                  </h1>

                  <p className="text-xl text-zinc-400 mb-4 hover:text-white transition-colors">{song.artist}</p>

                  {song.genre && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-400 text-sm rounded-full border border-green-500/20 mb-6">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      {song.genre}
                    </span>
                  )}

                  {/* Acciones */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <button
                      onClick={handlePlay}
                      className="flex-1 px-6 py-3 bg-green-500 text-black font-semibold rounded-full hover:bg-green-400 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
                    >
                      <span className="text-lg">▶</span>
                      {t('details.play')}
                    </button>
                    <button
                      onClick={handleAddToFavorites}
                      className={`flex-1 px-6 py-3 font-semibold rounded-full transition-all duration-200 border flex items-center justify-center gap-2 ${
                        isFavorite 
                          ? 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30' 
                          : 'bg-white/10 text-white border-white/10 hover:bg-white/20 hover:scale-105 active:scale-95'
                      }`}
                    >
                      <span className={`text-lg ${isFavorite ? 'text-green-400' : ''}`}>
                        {isFavorite ? '♥' : '♡'}
                      </span>
                      {isFavorite ? t('details.removeFromFavorites') : t('details.addToFavorites')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Detalles adicionales */}
              <div className="mt-12 pt-8 border-t border-white/5">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-1 h-4 bg-green-500 rounded-full" />
                  {t('details.detailsTitle')}
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">
                      {t('details.artist')}
                    </p>
                    <p className="text-base font-semibold text-white">
                      {song.artist}
                    </p>
                  </div>

                  {song.genre && (
                    <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                      <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">
                        {t('details.genre')}
                      </p>
                      <p className="text-base font-semibold text-green-400 capitalize">
                        {song.genre}
                      </p>
                    </div>
                  )}

                  {calculatedDuration ? (
                    <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                      <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">
                        {t('details.duration')}
                      </p>
                      <p className="text-base font-semibold text-white">
                        {formatDuration(calculatedDuration)}
                      </p>
                    </div>
                  ) : (song.duration || song.length) && (
                    <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                      <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">
                        {t('details.duration')}
                      </p>
                      <p className="text-base font-semibold text-white">
                        {formatDuration(song.duration || song.length)}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* ID al final, menos visible */}
                <div className="mt-4 pt-4 border-t border-white/5">
                  <p className="text-xs text-zinc-600">
                    ID: <span className="font-mono text-zinc-500">{song.id}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
    </>
  );
}

export default SongDetails;
