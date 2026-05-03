import styles from "./AsyncState.module.css";

function AsyncState({
  loading,
  error,
  isEmpty,
  loadingMessage = "Cargando...",
  emptyMessage = "No hay resultados.",
  onRetry,
}) {
  if (loading) {
    return <p className={styles.loading}>{loadingMessage}</p>;
  }

  if (error) {
    return (
      <div className={styles.errorBox}>
        <p className={styles.errorText}>{error}</p>
        {typeof onRetry === "function" && (
          <button onClick={onRetry} className={styles.retryButton}>
            Reintentar
          </button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return <p className={styles.empty}>{emptyMessage}</p>;
  }

  return null;
}

export default AsyncState;
