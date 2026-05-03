import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Favorites.module.css";

function Favorites() {
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
            <p className={styles.eyebrow}>Tu biblioteca</p>
            <h1 className={styles.title}>Tus favoritos</h1>
            <p className={styles.body}>Accesos rapidos a lo que mas escuchas.</p>

            {favorites.length === 0 ? (
                <div className={styles.emptyBlock}>
                    <p className={styles.emptyTitle}>Todavia no guardaste canciones</p>
                    <p className={styles.emptyText}>Marca favoritos y van a aparecer en esta seccion.</p>
                    <Link to="/" className={styles.backLink}>Explorar canciones</Link>
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