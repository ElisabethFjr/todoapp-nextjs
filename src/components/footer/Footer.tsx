import styles from "./Footer.module.scss";

function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.text}>
        Made by Elisabeth with <span className={styles.bold}>NextJS</span>.
      </p>
    </footer>
  );
}

export default Footer;
