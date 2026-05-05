import { useId } from "react";
import styles from "./SearchBar.module.css";

function SearchBar({ searchTerm, onSearch }) {
  const inputId = useId();

  return (
    <div className={styles.searchBar}>
      <label htmlFor={inputId} className={styles.srOnly}>
        Buscar por cancion o artista
      </label>
      <span className={styles.icon} aria-hidden="true">⌕</span>
      <input
        id={inputId}
        type="search"
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Buscar por canción o artista..."
        autoComplete="off"
        className={styles.input}
      />
    </div>
  );
}

export default SearchBar;
