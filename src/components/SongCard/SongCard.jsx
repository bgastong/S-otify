import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SongCard.module.css";

function SongCard({ song, onSelectSong, isEmbeddable = true, isSelected = false }) {
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
      className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
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
        
        {/* Meta row: genre + warning */}
        <div className={styles.metaRow}>
          {song.genre && (
            <span className={styles.genre}>
              {song.genre}
            </span>
          )}
          {!isEmbeddable && (
            <span className={styles.warning}>
              <svg className={styles.warningIcon} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              No disponible
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default SongCard;