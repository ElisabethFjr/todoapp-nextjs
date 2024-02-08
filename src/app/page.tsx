"use client";

import { useState } from "react";
import Lists from "@/components/lists/Lists";
import AddListForm from "@/components/modals/addListForm/AddListForm";
import { PlusCircle } from "react-bootstrap-icons";
import styles from "./page.module.scss";

export default function Home() {
  const [isOpenAddListModal, setIsOpenAddListModal] = useState<boolean>(false);

  // hHndle Click to open the Add Form Modal
  const handleOpenAddForm = () => {
    setIsOpenAddListModal(!isOpenAddListModal);
  };

  return (
    <>
      <div className={styles.container}>
        <button className={styles.button} onClick={handleOpenAddForm}>
          <PlusCircle />
          Créer une liste
        </button>
      </div>
      <Lists />
      {isOpenAddListModal && (
        <AddListForm closeModal={() => setIsOpenAddListModal(false)} />
      )}
    </>
  );
}
