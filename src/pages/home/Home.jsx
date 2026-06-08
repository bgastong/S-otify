import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { songsService } from "../../services/songsService";
import useAsyncStatus from "../../hooks/useAsyncStatus";
import AsyncState from "../../components/AsyncState/AsyncState";
import SongCard from "../../components/SongCard/SongCard";
import styles from "./Home.module.css";

function Home({ searchTerm = "", currentGenre = "" }) {
  const { t } = useTranslation();
  const [songs, setSongs] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { loading, error, runTask } = useAsyncStatus();
  const isSearching = searchTerm.trim().length > 0;
  const requestIdRef = useRef(0);
  const observerRef = useRef(null);
  const pageRef = useRef(1);

const PAGE_SIZE = 20;

const fetchSongs = useCallback(
  async (search, genre, page = 1, isLoadingMore = false) => {
    const currentRequestId = requestIdRef.current + 1;
    requestIdRef.current = currentRequestId;

    const fetchTask = async () => {
      const query = search.trim();
      const options = { page, limit: PAGE_SIZE, genre };

      if (!query) {
        return songsService.getSongs(options);
      }

      return songsService.searchSongs(query, options);
    };

    const data = await runTask(fetchTask, t("home.errorMessage"));

    if (currentRequestId !== requestIdRef.current) {
      return;
    }

    if (Array.isArray(data)) {
      if (isLoadingMore) {
        setSongs((prev) => [...prev, ...data]);
      } else {
        setSongs(data);
      }

      setHasMore(data.length === PAGE_SIZE);
      return;
    }

    if (!isLoadingMore) {
      setSongs([]);
    }

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
      { rootMargin: "100px", threshold: 0 },
    );

    if (observerRef.current && songs.length > 0 && !error) {
      observer.observe(observerRef.current);
    }

    return () => {
      observer.disconnect();
    };
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

  return (
    <section className={styles.homePage}>
      <div className={styles.surface}>
        {!isSearching && (
          <div className={styles.hero}>
            <p className={styles.eyebrow}>{t("home.eyebrow")}</p>
            <h1 className={styles.title}>{t("home.title")}</h1>
            <p className={styles.subtitle}>{t("home.subtitle")}</p>
          </div>
        )}

        <AsyncState
          loading={loading}
          error={error}
          isEmpty={!loading && !error && songs.length === 0}
          loadingMessage={t("home.loadingMessage")}
          emptyMessage={t("home.emptyMessage")}
          onRetry={() => fetchSongs(searchTerm, currentGenre)}
        />

        {!isSearching && (
          <>
            <h2 className={styles.sectionTitle}>{t("home.sectionTitle")}</h2>
            <p className={styles.sectionSubtitle}>
              {t("home.sectionSubtitle")}
            </p>
          </>
        )}

        {songs.length > 0 && (
          <div className={styles.cardsGrid}>
            {songs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}

        {/* Sentinel fuera del grid para que sea detectable */}
        {songs.length > 0 && hasMore && !error && (
          <div ref={observerRef} className="h-8 w-full" />
        )}

        {loadingMore && (
          <div style={{ textAlign: "center", padding: "2rem", color: "#888" }}>
            {t("home.loadingMessage")}
          </div>
        )}
      </div>
    </section>
  );
}

export default Home;
