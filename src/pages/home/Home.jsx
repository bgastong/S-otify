import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { songsService } from "../../services/songsService";
import useAsyncStatus from "../../hooks/useAsyncStatus";
import SearchBar from "../../components/SearchBar/SearchBar";
import FilterSong from "../../components/FilterSong/FilterSong";
import AsyncState from "../../components/AsyncState/AsyncState";
import SongCard from "../../components/SongCard/SongCard";
import styles from "./Home.module.css";

function Home() {
  const { t } = useTranslation();
  const [songs, setSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ genre: "" });
  const [allGenres, setAllGenres] = useState([]);
  const [genresError, setGenresError] = useState("");
  const { loading, error, runTask } = useAsyncStatus();
  const isSearching = searchTerm.trim().length > 0;
  const requestIdRef = useRef(0);

  const fetchSongs = useCallback(async (search, genre) => {
    const currentRequestId = requestIdRef.current + 1;
    requestIdRef.current = currentRequestId;

    const data = await runTask(
      () => {
        const query = search.trim();
        const options = { page: 1, limit: 30, genre };
        if (!query) {
          return songsService.getSongs(options);
        }
        return songsService.searchSongs(query, options);
      },
      t('home.errorMessage')
    );

    if (currentRequestId !== requestIdRef.current) {
      return;
    }

    if (Array.isArray(data)) {
      setSongs(data);
      return;
    }
    setSongs([]);
  }, [runTask, t]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSongs(searchTerm, filters.genre);
    }, 80);

    return () => clearTimeout(timer);
  }, [searchTerm, filters.genre, fetchSongs]);

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
          onRetry={() => fetchSongs(searchTerm, filters.genre)}
        />

        {!isSearching && (
          <>
            <h2 className={styles.sectionTitle}>{t('home.sectionTitle')}</h2>
            <p className={styles.sectionSubtitle}>{t('home.sectionSubtitle')}</p>
          </>
        )}

        {songs.length > 0 && (
          <div className={styles.cardsGrid}>
            {songs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Home;