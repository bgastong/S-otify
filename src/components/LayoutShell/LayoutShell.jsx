import styles from "./LayoutShell.module.css";

function LayoutShell({ children }) {
  return (
    <main className={styles.main}>
      <div className={styles.glassContainer}>
        <div className={styles.ambientGlow} />
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </main>
  );
}

export default LayoutShell;