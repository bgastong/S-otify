import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SongCard.module.css";

function SongCard({ song, onSelectSong, isEmbeddable = true }) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleCardClick = () => {
    if (typeof onSelectSong === "function") {
      onSelectSong(song);
    }
    navigate(`/details/${song.id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      handleCardClick();
    }
  };

  return (
    <article
      className={styles.card}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className={styles.imageContainer}>
        {!imageError && song.image ? (
          <img
            src={song.image}
            alt={`Portada de ${song.name}`}
            className={styles.image}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span className={styles.placeholderIcon}>♪</span>
          </div>
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>
          {song.name}
        </h3>
        <p className={styles.artist}>
          {song.artist}
        </p>
        {!isEmbeddable && (
          <p className={styles.warning}>
            Reproducción no disponible
          </p>
        )}
        {song.genre && (
          <p className={styles.genre}>
            {song.genre}
          </p>
        )}
      </div>
    </article>
  );
}

export default SongCard;