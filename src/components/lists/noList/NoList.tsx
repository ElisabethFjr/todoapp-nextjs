import Image from "next/image";
import styles from "./NoList.module.scss";

function NoList() {
  return (
    <div className={styles.container}>
      <Image src="/images/to-do-list.png" alt="Icon" width="180" height="180" />
      <p className={styles.text}>Aucune liste enregistrée pour le moment.</p>
    </div>
  );
}

export default NoList;
