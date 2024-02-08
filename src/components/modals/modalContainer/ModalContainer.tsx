import { XLg } from "react-bootstrap-icons";
import styles from "./ModalContainer.module.scss";

interface ModalContainerProps {
  children: React.ReactNode;
  handleClose: () => void;
  color?: string;
}

function ModalContainer({ children, handleClose, color }: ModalContainerProps) {
  return (
    <div className={styles.background}>
      <div
        className={
          color ? styles.container : `${styles.container} ${styles.white}`
        }
        style={{ backgroundColor: color }}
      >
        {children}
        <button
          type="button"
          className={styles.close}
          onClick={handleClose}
          aria-label="Fermer la modale"
          title="Fermer"
        >
          <XLg className={styles.icon} size={18} />
        </button>
      </div>
    </div>
  );
}

export default ModalContainer;
