import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Favorites.module.css";

function Favorites() {
  const { t } = useTranslation();
  const [favorites] = useState(() => {
    const fromPrimaryKey = localStorage.getItem("favoriteSongs");
    const fromLegacyKey = localStorage.getItem("favorites");
    const raw = fromPrimaryKey || fromLegacyKey;
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  return (
    <section className={styles.favoritesPage}>
      <p className={styles.eyebrow}>{t('favorites.eyebrow')}</p>
      <h1 className={styles.title}>{t('favorites.title')}</h1>
      <p className={styles.body}>{t('favorites.body')}</p>

      {favorites.length === 0 ? (
        <div className={styles.emptyBlock}>
          <p className={styles.emptyTitle}>{t('favorites.emptyTitle')}</p>
          <p className={styles.emptyText}>{t('favorites.emptyText')}</p>
          <Link to="/" className={styles.backLink}>{t('favorites.exploreLink')}</Link>
        </div>
      ) : (
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
    </section>
  );
}

export default Favorites;