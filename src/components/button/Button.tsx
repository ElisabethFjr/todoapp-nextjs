import { PlusCircle } from "react-bootstrap-icons";
import Link from "next/link";
import styles from "./Button.module.scss";

function Button() {
  return (
    <div className={styles.button}>
      <Link href="/" className={styles.link}>
        <PlusCircle />
        Créer une liste
      </Link>
    </div>
  );
}

export default Button;
