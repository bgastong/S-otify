import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { songsService } from "../../services/songsService";
import AsyncState from "../../components/AsyncState/AsyncState";
import SongCard from "../../components/SongCard/SongCard";
import { useAuth } from "../../context/AuthContext";

function Favorites({ onSelectSong }) {
  const { i18n } = useTranslation();
  const { user, token } = useAuth();
  const isEn = i18n.language?.startsWith("en");

  const copy = {
    playlist: isEn ? "Playlist" : "Playlist",
    title: isEn ? "Your favorites" : "Tus favoritos",
    saved: isEn ? "saved songs" : "canciones guardadas",
    loading: isEn ? "Loading favorites..." : "Cargando favoritos...",
    empty: isEn
      ? "You haven’t added songs to favorites yet."
      : "Todavía no agregaste canciones a favoritos.",
    explore: isEn ? "Explore songs" : "Explorar canciones",
    loginTitle: isEn ? "Log in to see your favorites" : "Iniciá sesión para ver tus favoritos",
    loginText: isEn
      ? "Favorites are saved to your account and synced with the database."
      : "Los favoritos se guardan en tu cuenta y se sincronizan con la base de datos.",
    loginButton: isEn ? "Log in" : "Iniciar sesión",
    registerButton: isEn ? "Create account" : "Crear cuenta",
  };

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchFavorites = useCallback(async () => {
    if (!token) {
      setFavorites([]);
      setLoading(false);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await songsService.getFavorites();
      const normalized = Array.isArray(data)
        ? data.map((item) => item.song || item).filter(Boolean)
        : [];

      setFavorites(normalized);
    } catch (err) {
      setError(err.message || "No pudimos cargar tus favoritos.");
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return (
    <section>
      <article className="overflow-hidden rounded-2xl bg-[#121212]">
        <div className="bg-gradient-to-b from-[#1f5132] via-[#181818] to-[#121212] p-6 md:p-9">
          <div className="flex flex-col gap-6 md:flex-row md:items-end">
            <div className="grid h-56 w-56 shrink-0 place-items-center rounded-md bg-gradient-to-br from-[#1db954] to-[#1b3325] text-7xl shadow-2xl shadow-black/60">
              ♥
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-300">
                {copy.playlist}
              </p>

              <h1 className="mt-3 text-5xl font-black leading-none md:text-7xl">
                {copy.title}
              </h1>

              <p className="mt-5 text-sm text-zinc-300">
                {user ? `${favorites.length} ${copy.saved}` : copy.loginText}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-b from-black/30 to-[#121212] p-6 md:p-9">
          {!token ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-black text-white">
                {copy.loginTitle}
              </h2>

              <p className="mt-2 max-w-xl text-sm text-zinc-400">
                {copy.loginText}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/login"
                  className="rounded-full bg-[#1db954] px-6 py-3 font-black text-black transition hover:scale-105"
                >
                  {copy.loginButton}
                </Link>

                <Link
                  to="/register"
                  className="rounded-full bg-white/10 px-6 py-3 font-black text-white transition hover:bg-white/15"
                >
                  {copy.registerButton}
                </Link>
              </div>
            </div>
          ) : (
            <>
              <AsyncState
                loading={loading}
                error={error}
                isEmpty={!loading && !error && favorites.length === 0}
                loadingMessage={copy.loading}
                emptyMessage={copy.empty}
                onRetry={fetchFavorites}
              />

              {!loading && !error && favorites.length === 0 && (
                <Link
                  to="/"
                  className="mt-4 inline-block rounded-full bg-[#1db954] px-6 py-3 font-black text-black transition hover:scale-105"
                >
                  {copy.explore}
                </Link>
              )}

              {favorites.length > 0 && (
                <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                  {favorites.map((song) => (
                    <SongCard
                      key={song.id}
                      song={song}
                      onSelectSong={onSelectSong}
                      isSelected
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </article>
    </section>
  );
}

export default Favorites;