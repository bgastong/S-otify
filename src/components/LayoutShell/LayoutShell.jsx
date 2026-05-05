import styles from "./LayoutShell.module.css";

function LayoutShell({ children }) {
  return <main className={styles.main}>{children}</main>;
}

export default LayoutShell;
