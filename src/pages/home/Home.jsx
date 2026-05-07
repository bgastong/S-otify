import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { songsService } from "../../services/songsService";
import useAsyncStatus from "../../hooks/useAsyncStatus";
import SearchBar from "../../components/SearchBar/SearchBar";
import FilterSong from "../../components/FilterSong/FilterSong";
import AsyncState from "../../components/AsyncState/AsyncState";
import SongCard from "../../components/SongCard/SongCard";
import { isYouTubeEmbeddable } from "../../utils/youtubeValidation";
import styles from "./Home.module.css";

function Home({ onSelectSong }) {
  const { t } = useTranslation();
  const [songs, setSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ genre: "" });
  const [allGenres, setAllGenres] = useState([]);
  const [embeddableBySongId, setEmbeddableBySongId] = useState({});
  const [genresError, setGenresError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { loading, error, runTask } = useAsyncStatus();
  const isSearching = searchTerm.trim().length > 0;
  const requestIdRef = useRef(0);
  const sentinelRef = useRef(null);

  const fetchSongs = useCallback(async (search, genre, pageNum = 1) => {
    const currentRequestId = requestIdRef.current + 1;
    requestIdRef.current = currentRequestId;

    const data = await runTask(
      () => {
        const query = search.trim();
        const options = { page: pageNum, limit: 10, genre };
        if (!query) {
          return songsService.getSongs(options);
        }
        return songsService.searchSongs(query, options);
      },
      t('home.errorMessage')
    );

    if (currentRequestId !== requestIdRef.current) {
      return null;
    }

    if (Array.isArray(data)) {
      return data;
    }
    return [];
  }, [runTask, t]);

  const resetAndFetch = useCallback(async (search, genre) => {
    setPage(1);
    setHasMore(true);
    const data = await fetchSongs(search, genre, 1);
    if (data) {
      setSongs(data);
      setHasMore(data.length === 10);
    } else {
      setSongs([]);
      setHasMore(false);
}
  }, [fetchSongs]);

  const loadMoreSongs = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);

    const nextPage = page + 1;
    const data = await fetchSongs(searchTerm, filters.genre, nextPage);

  if (data && data.length > 0) {
    setSongs((prev) => [...prev, ...data]);
    setPage(nextPage);
    setHasMore(data.length === 10);
  } else {
    setHasMore(false);
  }

    setIsLoadingMore(false);
  }, [page, hasMore, isLoadingMore, searchTerm, filters.genre, fetchSongs]);

  useEffect(() => {
    const timer = setTimeout(() => {
      resetAndFetch(searchTerm, filters.genre);
    }, 80);

    return () => clearTimeout(timer);
  }, [searchTerm, filters.genre, resetAndFetch]);

  useEffect(() => {
    let isMounted = true;

    const validateEmbeddableSongs = async () => {
      if (!songs.length) {
        if (isMounted) {
          setEmbeddableBySongId({});
        }
        return;
      }

      const validations = await Promise.all(
        songs.map(async (song) => {
          const isEmbeddable = await isYouTubeEmbeddable(song.youtubeId);
          return [song.id, isEmbeddable];
        })
      );

      if (!isMounted) {
        return;
      }

      setEmbeddableBySongId(Object.fromEntries(validations));
    };

    validateEmbeddableSongs();

    return () => {
      isMounted = false;
    };
  }, [songs]);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !loading) {
          loadMoreSongs();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoadingMore, loading, loadMoreSongs]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setGenresError("");
        const list = await songsService.getSongs({ page: 1, limit: 100 });
        const uniqueGenres = [...new Set(list.map((song) => song.genre).filter(Boolean))].sort();
        setAllGenres(uniqueGenres);
      } catch {
        setAllGenres([]);
        setGenresError(t('home.genresError'));
      }
    };

    fetchGenres();
  }, [t]);

  const genres = useMemo(() => allGenres, [allGenres]);

  return (
    <section className={styles.homePage}>
      <div className={styles.surface}>
        {!isSearching && (
          <div className={styles.hero}>
            <p className={styles.eyebrow}>{t('home.eyebrow')}</p>
            <h1 className={styles.title}>{t('home.title')}</h1>
            <p className={styles.subtitle}>{t('home.subtitle')}</p>
          </div>
        )}

        <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} t={t} />

        <FilterSong
          genres={genres}
          filters={filters}
          onFilterChange={setFilters}
          t={t}
        />

        {genresError && (
          <p className={styles.sectionSubtitle}>{genresError}</p>
        )}

        <AsyncState
          loading={loading}
          error={error}
          isEmpty={!loading && !error && songs.length === 0}
          loadingMessage={t('home.loadingMessage')}
          emptyMessage={t('home.emptyMessage')}
          onRetry={() => resetAndFetch(searchTerm, filters.genre)}
        />

        {!isSearching && (
          <>
            <h2 className={styles.sectionTitle}>{t('home.sectionTitle')}</h2>
            <p className={styles.sectionSubtitle}>{t('home.sectionSubtitle')}</p>
          </>
        )}

        {songs.length > 0 && (
          <>
            <div className={styles.cardsGrid}>
              {songs.map((song) => (
                <SongCard
                  key={song.id}
                  song={song}
                  isEmbeddable={embeddableBySongId[song.id] ?? true}
                  onSelectSong={onSelectSong}
                />
              ))}
              <div ref={sentinelRef} className={styles.sentinel} />
            </div>
            {isLoadingMore && (
              <div className={styles.loadingMore}>
                <p>{t('home.loadingMessage')}</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default Home;