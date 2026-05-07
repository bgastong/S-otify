import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { songsService } from "../../services/songsService";
import useAsyncStatus from "../../hooks/useAsyncStatus";
import SearchBar from "../../components/SearchBar/SearchBar";
import FilterSong from "../../components/FilterSong/FilterSong";
import AsyncState from "../../components/AsyncState/AsyncState";
import SongCard from "../../components/SongCard/SongCard";
import { isYouTubeEmbeddable } from "../../utils/youtubeValidation";
import styles from "./Home.module.css";

function Home({ onSelectSong }) {
  const [songs, setSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ genre: "" });
  const [allGenres, setAllGenres] = useState([]);
  const [embeddableBySongId, setEmbeddableBySongId] = useState({});
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
      "Ocurrio un error al cargar las canciones."
    );

    if (currentRequestId !== requestIdRef.current) {
      return;
    }

    if (Array.isArray(data)) {
      setSongs(data);
      return;
    }
    setSongs([]);
  }, [runTask]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSongs(searchTerm, filters.genre);
    }, 80);

    return () => clearTimeout(timer);
  }, [searchTerm, filters.genre, fetchSongs]);

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
    const fetchGenres = async () => {
      try {
        setGenresError("");
        const list = await songsService.getSongs({ page: 1, limit: 100 });
        const uniqueGenres = [...new Set(list.map((song) => song.genre).filter(Boolean))].sort();
        setAllGenres(uniqueGenres);
      } catch {
        setAllGenres([]);
        setGenresError("No se pudieron cargar los generos.");
      }
    };

    fetchGenres();
  }, []);

  const genres = useMemo(() => allGenres, [allGenres]);

  return (
    <section className={styles.homePage}>
      <div className={styles.surface}>
        {!isSearching && (
          <div className={styles.hero}>
            <p className={styles.eyebrow}>INICIO</p>
            <h1 className={styles.title}>Toda tu musica, en un solo lugar</h1>
            <p className={styles.subtitle}>Busca letra a letra por cancion o artista, y filtra por genero al instante.</p>
          </div>
        )}

        <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />

        <FilterSong
          genres={genres}
          filters={filters}
          onFilterChange={setFilters}
        />

        {genresError && (
          <p className={styles.sectionSubtitle}>{genresError}</p>
        )}

        <AsyncState
          loading={loading}
          error={error}
          isEmpty={!loading && !error && songs.length === 0}
          loadingMessage="Cargando canciones..."
          emptyMessage="No se encontraron canciones para tu busqueda."
          onRetry={() => fetchSongs(searchTerm, filters.genre)}
        />

        {!isSearching && (
          <>
            <h2 className={styles.sectionTitle}>Canciones para vos</h2>
            <p className={styles.sectionSubtitle}>Resultados dinamicos desde API segun busqueda y genero.</p>
          </>
        )}

        {songs.length > 0 && (
          <div className={styles.cardsGrid}>
            {songs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                isEmbeddable={embeddableBySongId[song.id] ?? true}
                onSelectSong={onSelectSong}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Home;
