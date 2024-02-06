import { PencilSquare } from "react-bootstrap-icons";
import styles from "./Lists.module.scss";
import Image from "next/image";

function Lists() {
  return (
    <div className={styles.container}>
      <Image src="/images/to-do-list.png" alt="Icon" width="180" height="180" />
      <p className={styles.text}>Aucune liste enregistrée pour le moment.</p>
    </div>
  );
}

export default Lists;
