import styles from "./Details.module.css";

export default function Details() {
    return (
        <section className={styles.detailsPage}>
            <p className={styles.eyebrow}>Detalle</p>
            <h1 className={styles.title}>Vista de canción</h1>
            <p className={styles.body}>
                Esta pantalla ya está preparada con estética tipo Spotify para integrar el fetch por ID y el 404 obligatorio del TP.
            </p>

            <div className={styles.infoCard}>
                <p className={styles.infoTitle}>Información ampliada</p>
                <p className={styles.infoText}>
                    Acá van artista, álbum, duración y metadatos adicionales.
                </p>
            </div>
        </section>
    );
}