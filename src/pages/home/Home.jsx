import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { songsService } from "../../services/songsService";
import useAsyncStatus from "../../hooks/useAsyncStatus";
import AsyncState from "../../components/AsyncState/AsyncState";
import SongCard from "../../components/SongCard/SongCard";

const PAGE_SIZE = 20;

function Home({ searchTerm = "", currentGenre = "", onSelectSong }) {
  const { t } = useTranslation();
  const [songs, setSongs] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { loading, error, runTask } = useAsyncStatus();

  const isFiltering =
    searchTerm.trim().length > 0 || currentGenre.trim().length > 0;

  const requestIdRef = useRef(0);
  const observerRef = useRef(null);
  const pageRef = useRef(1);

  const fetchSongs = useCallback(
    async (search, genre, page = 1, isLoadingMore = false) => {
      const currentRequestId = requestIdRef.current + 1;
      requestIdRef.current = currentRequestId;

      const fetchTask = async () => {
        const query = search.trim();
        const options = { page, limit: PAGE_SIZE, genre };

        return query
          ? songsService.searchSongs(query, options)
          : songsService.getSongs(options);
      };

      const data = await runTask(fetchTask, t("home.errorMessage"));

      if (currentRequestId !== requestIdRef.current) return;

      if (Array.isArray(data)) {
        setSongs((prev) => (isLoadingMore ? [...prev, ...data] : data));
        setHasMore(data.length === PAGE_SIZE);
        return;
      }

      if (!isLoadingMore) setSongs([]);
      setHasMore(false);
    },
    [runTask, t],
  );

  useEffect(() => {
    pageRef.current = 1;

    const timer = setTimeout(() => {
      setHasMore(true);
      fetchSongs(searchTerm, currentGenre, 1, false);
    }, 80);

    return () => clearTimeout(timer);
  }, [searchTerm, currentGenre, fetchSongs]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          setLoadingMore(true);

          const nextPage = pageRef.current + 1;
          pageRef.current = nextPage;

          fetchSongs(searchTerm, currentGenre, nextPage, true).finally(() => {
            setLoadingMore(false);
          });
        }
      },
      { rootMargin: "220px", threshold: 0 },
    );

    if (observerRef.current && songs.length > 0 && !error) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [
    hasMore,
    loading,
    loadingMore,
    searchTerm,
    currentGenre,
    fetchSongs,
    songs.length,
    error,
  ]);

  const quickSongs = songs.slice(0, 6);

  return (
    <section className="space-y-10">
      {!isFiltering && (
        <section>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
            {t("home.title")}
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            {t("home.subtitle")}
          </p>

          {quickSongs.length > 0 && (
            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {quickSongs.map((song) => (
                <button
                  key={song.id}
                  type="button"
                  onClick={() => onSelectSong?.(song, { autoplay: true })}
                  className="group flex h-20 items-center overflow-hidden rounded-lg bg-white/10 text-left transition hover:bg-white/20"
                >
                  {song.image ? (
                    <img
                      src={song.image}
                      alt={song.name}
                      className="h-20 w-20 object-cover"
                    />
                  ) : (
                    <div className="grid h-20 w-20 place-items-center bg-[#242424] text-zinc-500">
                      ♪
                    </div>
                  )}

                  <div className="min-w-0 px-4">
                    <p className="truncate text-sm font-black text-white">
                      {song.name}
                    </p>
                    <p className="truncate text-xs text-zinc-400">
                      {song.artist}
                    </p>
                  </div>

                  <span className="ml-auto mr-4 hidden h-11 w-11 place-items-center rounded-full bg-[#1db954] text-black shadow-xl group-hover:grid">
                    ▶
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      <AsyncState
        loading={loading}
        error={error}
        isEmpty={!loading && !error && songs.length === 0}
        loadingMessage={t("home.loadingMessage")}
        emptyMessage={t("home.emptyMessage")}
        onRetry={() => fetchSongs(searchTerm, currentGenre)}
      />

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white">
              {isFiltering ? t("home.resultsTitle", "Resultados") : t("home.sectionTitle")}
            </h2>

            <p className="mt-1 text-sm text-zinc-400">
              {t("home.sectionSubtitle")}
            </p>
          </div>

          {currentGenre && (
            <span className="rounded-full bg-white px-4 py-2 text-xs font-bold uppercase text-black">
              {currentGenre}
            </span>
          )}
        </div>

        {songs.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7">
            {songs.map((song) => (
              <SongCard key={song.id} song={song} onSelectSong={onSelectSong} />
            ))}
          </div>
        )}
      </section>

      {songs.length > 0 && hasMore && !error && (
        <div ref={observerRef} className="h-12 w-full" />
      )}

      {loadingMore && (
        <div className="py-8 text-center text-sm font-medium text-zinc-400">
          {t("home.loadingMessage")}
        </div>
      )}
    </section>
  );
}

export default Home;