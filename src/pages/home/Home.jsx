import { useState, useEffect, useMemo } from "react";
import { getAllSongs } from "../../services/getAllSongs";
import SearchBar from "../../components/SearchBar/SearchBar";
import FilterSong from "../../components/FilterSong/FilterSong";
import styles from "./Home.module.css";

function Home() {
  // ── Estado principal ──────────────────────────────────────────────
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ genre: "" });

  // ── Estado de paginación (para scroll infinito – implementado por compañero) ──
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // ── Fetch desde la API ────────────────────────────────────────────
  // La búsqueda se hace contra el endpoint (no filtrado local),
  // conforme a la consigna: "Es necesario hacer una llamada a un
  // endpoint con el campo de búsqueda".
  const fetchSongs = async (currentPage, search) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllSongs(currentPage, search);
      // Si es página 1, reemplaza la lista; si es mayor, acumula
      // (el compañero del scroll infinito llamará con páginas > 1)
      if (currentPage === 1) {
        setSongs(data);
      } else {
        setSongs((prev) => [...prev, ...data]);
      }
      // MockAPI devuelve array vacío o menor al límite cuando no hay más
      setHasMore(data.length === 10);
    } catch (err) {
      setError(err.message || "Ocurrió un error al cargar las canciones.");
    } finally {
      setLoading(false);
    }
  };

  // ── Efecto: debounce de búsqueda ─────────────────────────────────
  // Cada vez que searchTerm cambia, espera 400 ms antes de llamar la API
  // para no hacer una petición por cada tecla pulsada.
  useEffect(() => {
    setPage(1);
    const timer = setTimeout(() => {
      fetchSongs(1, searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ── Géneros únicos (derivados de la lista actual) ─────────────────
  // useMemo evita recalcular el array de géneros en cada render.
  const genres = useMemo(() => {
    const unique = [...new Set(songs.map((s) => s.genre).filter(Boolean))];
    return unique.sort();
  }, [songs]);

  // ── Lista filtrada por género (filtro adicional cliente) ──────────
  // El filtro de texto ya lo hace la API; el de género se aplica
  // sobre los resultados recibidos sin llamada extra.
  const filteredSongs = useMemo(() => {
    if (!filters.genre) return songs;
    return songs.filter((s) => s.genre === filters.genre);
  }, [songs, filters.genre]);

  // ── Render ───────────────────────────────────────────────────────
  return (
    <section className={styles.homePage}>
      <div className={styles.surface}>
        <div className={styles.hero}>
          <p className={styles.eyebrow}>S-otify</p>
          <h1 className={styles.title}>Buenas noches</h1>
          <p className={styles.subtitle}>Descubrí, buscá y filtrá canciones como en Spotify.</p>
        </div>

        {/* Buscador */}
        <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />

        {/* Filtro por género */}
        <FilterSong
          genres={genres}
          filters={filters}
          onFilterChange={setFilters}
        />

        {/* Estado de carga */}
        {loading && page === 1 && (
          <p className={styles.stateMessage}>Cargando canciones...</p>
        )}

        {/* Estado de error */}
        {error && (
          <div className={styles.errorBox}>
            <p className={styles.errorText}>{error}</p>
            <button
              onClick={() => fetchSongs(1, searchTerm)}
              className={styles.retryButton}
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Sin resultados */}
        {!loading && !error && filteredSongs.length === 0 && (
          <p className={styles.stateMessage}>
            No se encontraron canciones para tu búsqueda.
          </p>
        )}

        {/* ── LISTA DE CARDS ─────────────────────────────────────────
            Esta sección es implementada por el compañero encargado de
            las cards y el scroll infinito.
            Datos disponibles:
              - filteredSongs : array de canciones a mostrar
              - loading       : true mientras se carga una página
              - hasMore       : false cuando ya no hay más páginas
        ───────────────────────────────────────────────────────────── */}
        <h2 className={styles.sectionTitle}>Canciones para vos</h2>
        <p className={styles.sectionSubtitle}>Resultados dinámicos según tu búsqueda y filtros.</p>

        <div className={styles.cardsGrid}>
          {filteredSongs.map((song) => (
            // TODO: reemplazar este div por <SongCard song={song} />
            <div key={song.id} className={styles.tempCard}>
              <div className={styles.tempCover}>
                <div className={styles.playBubble}>▶</div>
              </div>
              <p className={styles.tempCardTitle}>{song.name}</p>
              <p className={styles.tempCardMeta}>Card temporal hasta integrar el componente final.</p>
            </div>
          ))}
        </div>

        {/* Indicador de carga de páginas adicionales (scroll infinito) */}
        {loading && page > 1 && (
          <p className={styles.loaderMore}>Cargando más...</p>
        )}

        {/* Ancla para IntersectionObserver del scroll infinito */}
        {/* TODO: compañero adjunta ref de IntersectionObserver aquí */}
        <div id="scroll-anchor" className="h-4" />
      </div>
    </section>
  );
}

export default Home;
