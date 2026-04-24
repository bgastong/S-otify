import styles from "./Favorites.module.css";

function Favorites() {
    return (
        <section className={styles.favoritesPage}>
            <p className={styles.eyebrow}>Biblioteca</p>
            <h1 className={styles.title}>Tus favoritos</h1>
            <p className={styles.body}>
                Acá va la lista de favoritos desde localStorage. Si está vacía, mostrar mensaje acorde según la consigna.
            </p>

            <div className={styles.emptyBlock}>
                <p className={styles.emptyTitle}>Todavía no guardaste canciones</p>
                <p className={styles.emptyText}>
                    Explorá el inicio y agregá tus temas preferidos para verlos acá.
                </p>
            </div>
        </section>
    );
}

export default Favorites;