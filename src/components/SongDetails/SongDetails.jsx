import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { songsService } from "../../services/songsService";
import AsyncState from "../AsyncState/AsyncState";

function SongDetails({ onSelectSong }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

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

  const handleAddToFavorites = () => {
    // TODO: Implementar lógica de favoritos
    console.log("Canción agregada a favoritos:", song.id);
  };

  const handlePlay = () => {
    if (song && typeof onSelectSong === "function") {
      onSelectSong(song, { autoplay: true });
    }
  };

  return (
    <section className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="cursor-pointer mb-6 px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors flex items-center gap-2 group"
        >
          <span className=" text-lg group-hover:-translate-x-1 transition-transform">←</span>
          {t('details.back')}
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
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 overflow-hidden backdrop-blur-sm">
            {/* Header con imagen de fondo */}
            <div className="relative h-64 md:h-96 overflow-hidden bg-gradient-to-br from-zinc-900 to-black">
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
                  <div className="w-full md:w-48 aspect-square rounded-lg overflow-hidden border border-white/10 shadow-2xl">
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
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-2">
                    {t('details.songType')}
                  </p>
                  <h1 className="text-4xl md:text-5xl font-black text-white mb-2 leading-tight">
                    {song.name}
                  </h1>

                  <p className="text-xl text-white/70 mb-6">{song.artist}</p>

                  {song.genre && (
                    <p className="inline-block px-3 py-1 bg-white/10 rounded-full text-sm text-white/70 mb-6">
                      {song.genre}
                    </p>
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
                      className="flex-1 px-6 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-200 border border-white/10 flex items-center justify-center gap-2"
                    >
                      <span className="text-lg">♡</span>
                      {t('details.addToFavorites')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Detalles adicionales */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <h2 className="text-xl font-bold text-white mb-6">{t('details.detailsTitle')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/50 mb-2">
                      {t('details.artist')}
                    </p>
                    <p className="text-lg font-semibold text-white">
                      {song.artist}
                    </p>
                  </div>

                  {song.genre && (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-white/50 mb-2">
                        {t('details.genre')}
                      </p>
                      <p className="text-lg font-semibold text-white capitalize">
                        {song.genre}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/50 mb-2">
                      {t('details.id')}
                    </p>
                    <p className="text-lg font-semibold text-white/70 font-mono">
                      {song.id}
                    </p>
                  </div>

                  {song.duration && (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-white/50 mb-2">
                        {t('details.duration')}
                      </p>
                      <p className="text-lg font-semibold text-white">
                        {song.duration}
                      </p>
                    </div>
                  )}

                  {song.year && (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-white/50 mb-2">
                        {t('details.year')}
                      </p>
                      <p className="text-lg font-semibold text-white">
                        {song.year}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default SongDetails;
