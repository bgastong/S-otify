import styles from "./SearchBar.module.css";

function SearchBar({ searchTerm, onSearch }) {
  return (
    <div className={styles.searchBar}>
      <span className={styles.icon}>⌕</span>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="¿Qué querés escuchar?"
        className={styles.input}
      />
    </div>
  );
}

export default SearchBar;
