import { XLg } from "react-bootstrap-icons";
import styles from "./ModalContainer.module.scss";

interface ModalContainerProps {
  children: React.ReactNode;
  handleClose: () => void;
}

function ModalContainer({ children, handleClose }: ModalContainerProps) {
  return (
    <div className={styles.background}>
      <div className={styles.container}>
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
