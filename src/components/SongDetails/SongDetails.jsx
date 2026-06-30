import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { songsService } from "../../services/songsService";
import AsyncState from "../AsyncState/AsyncState";
import { useAuth } from "../../context/AuthContext";

function formatDuration(duration) {
  if (!duration) return "0:00";

  if (typeof duration === "number") {
    const mins = Math.floor(duration / 60);
    const secs = Math.floor(duration % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  if (typeof duration === "string" && duration.includes(":")) return duration;

  return "0:00";
}

function SongDetails({ onSelectSong }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { token } = useAuth();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [calculatedDuration, setCalculatedDuration] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchSong() {
      setLoading(true);
      setError("");

      try {
        const data = await songsService.getSongById(id);
        if (isMounted) setSong(data);
      } catch (err) {
        if (isMounted) setError(err.message || t("details.errorMessage"));
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchSong();

    return () => {
      isMounted = false;
    };
  }, [id, t]);

useEffect(() => {
  let isMounted = true;

  async function fetchFavoriteState() {
    if (!song?.id) return;

    if (!token) {
      setIsFavorite(false);
      return;
    }

    try {
      const data = await songsService.isFavorite(song.id);
      if (isMounted) setIsFavorite(Boolean(data?.isFavorite));
    } catch {
      if (isMounted) setIsFavorite(false);
    }
  }

  fetchFavoriteState();

  return () => {
    isMounted = false;
  };
}, [song?.id, token]);

  useEffect(() => {
    if (!song?.audioUrl || !audioRef.current) return;

    audioRef.current.src = song.audioUrl;
    audioRef.current.load();

    const handleLoadedMetadata = () => {
      if (audioRef.current?.duration && isFinite(audioRef.current.duration)) {
        setCalculatedDuration(audioRef.current.duration);
      }
    };

    audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audioRef.current?.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [song?.audioUrl]);

  const handleFavorite = async () => {
  if (!song) return;

  if (!token) {
    setError("Tenés que iniciar sesión para usar favoritos.");
    return;
  }

  try {
    setError("");

    if (isFavorite) {
      await songsService.removeFavorite(song.id);
      setIsFavorite(false);
    } else {
      await songsService.addFavorite(song.id);
      setIsFavorite(true);
    }
  } catch (err) {
    setError(err.message || t("details.favoriteError"));
  }
};

  const handlePlay = () => {
    if (song && typeof onSelectSong === "function") {
      onSelectSong(song, { autoplay: true });
    }
  };

  const displayedDuration = formatDuration(calculatedDuration || song?.duration);

  return (
    <section>
      <audio ref={audioRef} className="hidden" preload="metadata" />

      <div className="mb-5 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="grid h-9 w-9 place-items-center rounded-full bg-black/50 text-zinc-300 transition hover:bg-white/10 hover:text-white"
          aria-label={t("details.back")}
        >
          ←
        </button>

        <Link
          to="/"
          className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-zinc-200 transition hover:bg-white/15"
        >
          {t("details.home")}
        </Link>
      </div>

      <AsyncState
        loading={loading}
        error={error}
        isEmpty={!loading && !error && !song}
        loadingMessage={t("details.loadingMessage")}
        emptyMessage={t("details.notFound")}
        onRetry={() => window.location.reload()}
      />

      {song && (
        <article className="relative overflow-hidden rounded-2xl bg-[#121212]">
          {song.image && !imageError && (
            <div
              className="absolute inset-x-0 top-0 h-96 opacity-30 blur-3xl"
              style={{
                backgroundImage: `url(${song.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          )}

          <div className="relative bg-gradient-to-b from-white/10 via-[#181818]/95 to-[#121212] p-6 md:p-9">
            <div className="flex flex-col gap-6 md:flex-row md:items-end">
              <div className="h-56 w-56 shrink-0 overflow-hidden rounded-md bg-[#242424] shadow-2xl shadow-black/60">
                {!imageError && song.image ? (
                  <img
                    src={song.image}
                    alt={song.name}
                    className="h-full w-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-6xl text-zinc-500">
                    ♪
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-300">
                  {t("details.songType")}
                </p>

                <h1 className="mt-3 break-words text-5xl font-black leading-none md:text-7xl">
                  {song.name}
                </h1>

                <p className="mt-5 text-sm font-bold text-white">
                  {song.artist}
                  <span className="font-normal text-zinc-400">
                    {" "}
                    • {song.album || "-"} • {displayedDuration}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="relative bg-gradient-to-b from-black/30 to-[#121212] p-6 md:p-9">
            <div className="mb-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handlePlay}
                disabled={!song.audioUrl}
                className="grid h-14 w-14 place-items-center rounded-full bg-[#1db954] text-xl text-black transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
                title={!song.audioUrl ? t("player.audioLoadError") : t("details.play")}
              >
                ▶
              </button>

              <button
                type="button"
                onClick={handleFavorite}
                className="text-3xl text-zinc-400 transition hover:text-white"
                title={isFavorite ? t("details.removeFromFavorites") : t("details.addToFavorites")}
              >
                {isFavorite ? "♥" : "♡"}
              </button>
            </div>

            <div>
              <div className="grid grid-cols-[40px_1fr_120px] border-b border-white/10 px-4 pb-3 text-sm text-zinc-400">
                <span>#</span>
                <span>{t("details.trackTitle")}</span>
                <span className="text-right">{t("details.duration")}</span>
              </div>

              <button
                type="button"
                onClick={handlePlay}
                disabled={!song.audioUrl}
                className="grid w-full grid-cols-[40px_1fr_120px] items-center rounded-md px-4 py-4 text-left transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="text-zinc-400">1</span>
                <span>
                  <span className="block font-bold text-white">{song.name}</span>
                  <span className="block text-sm text-zinc-400">{song.artist}</span>
                </span>
                <span className="text-right text-sm text-zinc-400">
                  {displayedDuration}
                </span>
              </button>
            </div>

            <section className="mt-10 border-t border-white/10 pt-8">
              <h2 className="mb-4 text-xl font-black">{t("details.detailsTitle")}</h2>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                    {t("details.genre")}
                  </p>
                  <p className="mt-2 font-bold text-white">{song.genre || "-"}</p>
                </div>

                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                    {t("details.album")}
                  </p>
                  <p className="mt-2 font-bold text-white">{song.album || "-"}</p>
                </div>

                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                    {t("details.duration")}
                  </p>
                  <p className="mt-2 font-bold text-white">{displayedDuration}</p>
                </div>
              </div>
            </section>
          </div>
        </article>
      )}
    </section>
  );
}

export default SongDetails;