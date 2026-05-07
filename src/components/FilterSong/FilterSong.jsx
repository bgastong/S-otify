import { useId } from "react";
import styles from "./FilterSong.module.css";

function FilterSong({ genres, filters, onFilterChange, t }) {
  const selectId = useId();

  const handleGenreChange = (e) => {
    onFilterChange((prev) => ({ ...prev, genre: e.target.value }));
  };

  return (
    <div className={styles.filterSong}>
      <label htmlFor={selectId} className={styles.label}>
        {t ? t('home.filterGenre') : 'Género'}
      </label>
      <select
        id={selectId}
        value={filters.genre}
        onChange={handleGenreChange}
        className={styles.select}
      >
        <option value="">{t ? t('home.filterAllGenres') : 'Todos los géneros'}</option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FilterSong;