import styles from "./Loading.module.css";

export default function Loading({ text = "Loading..." }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner} />
      <span>{text}</span>
    </div>
  );
}
