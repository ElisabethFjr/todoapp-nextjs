"use client";

import { useRouter } from "next/navigation";
import styles from "./not-found.module.scss";

function NotFound() {
  const router = useRouter();

  return (
    <div className={styles.error}>
      <h1 className={styles.title}>404 - Page non trouvée</h1>
      <p className={styles.text}>Tiens, il semble que tu te sois perdu.</p>
      <button
        className={styles.button}
        type="button"
        onClick={() => router.back()}
      >
        Retour
      </button>
    </div>
  );
}

export default NotFound;
