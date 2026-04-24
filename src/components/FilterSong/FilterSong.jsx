import styles from "./FilterSong.module.css";

function FilterSong({ genres, filters, onFilterChange }) {
  const handleGenreChange = (e) => {
    onFilterChange((prev) => ({ ...prev, genre: e.target.value }));
  };

  return (
    <div className={styles.filterSong}>
      <select
        value={filters.genre}
        onChange={handleGenreChange}
        className={styles.select}
      >
        <option value="">Todos los géneros</option>
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
