import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { songsService } from "../../services/songsService";
import AsyncState from "../../components/AsyncState/AsyncState";
import styles from "./Favorites.module.css";

function Favorites() {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFavorites = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await songsService.getFavorites();
      setFavorites(Array.isArray(data) ? data : data?.items || data?.favorites || []);
    } catch (err) {
      setError(err.message || "No pudimos cargar tus favoritos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <section className={styles.favoritesPage}>
      <p className={styles.eyebrow}>{t("favorites.eyebrow")}</p>
      <h1 className={styles.title}>{t("favorites.title")}</h1>
      <p className={styles.body}>{t("favorites.body")}</p>

      <AsyncState
        loading={loading}
        error={error}
        isEmpty={!loading && !error && favorites.length === 0}
        loadingMessage="Cargando favoritos..."
        emptyMessage={t("favorites.emptyText")}
        onRetry={fetchFavorites}
      />

      {!loading && !error && favorites.length > 0 && (
        <div className={styles.listGrid}>
          {favorites.map((song) => (
            <Link key={song.id} to={`/details/${song.id}`} className={styles.favoriteCard}>
              <img src={song.image} alt={song.name} className={styles.cover} />
              <div>
                <p className={styles.songTitle}>{song.name}</p>
                <p className={styles.songMeta}>{song.artist}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && !error && favorites.length === 0 && (
        <Link to="/" className={styles.backLink}>
          {t("favorites.exploreLink")}
        </Link>
      )}
    </section>
  );
}

export default Favorites;