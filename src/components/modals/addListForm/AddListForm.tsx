"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import ModalContainer from "../modalContainer/ModalContainer";
import { Plus, Square } from "react-bootstrap-icons";
import styles from "./AddListForm.module.scss";

interface AddListFormProps {
  closeModal: (value: React.SetStateAction<boolean>) => void;
}

function AddListForm({ closeModal }: AddListFormProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [title, setTitle] = useState<string>("");
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<string[]>([]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleTaskChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTask(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTasks([...tasks, task]);
    setTask("");
    const formData = new FormData(event.currentTarget);
    const formDataObject = Object.fromEntries(formData.entries());
    console.log(formDataObject);
  };

  const handleClose = () => {
    setIsOpen(!isOpen);
    closeModal(true);
  };

  return (
    <ModalContainer handleClose={handleClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.title}>
          <label className={styles.label} htmlFor="title"></label>
          <input
            className={styles.input}
            id="title"
            name="title"
            type="text"
            placeholder="Titre"
            value={title}
            onChange={handleTitleChange}
            required
          />
        </div>
        <div className={styles.tasks}>
          <label className={styles.label} htmlFor="task">
            <Plus />
          </label>
          <input
            className={styles.input}
            id="task"
            name="task"
            type="text"
            placeholder="Nouvelle tâche"
            value={task}
            onChange={handleTaskChange}
          />
          <button className={styles.submit} type="submit" />
        </div>
      </form>
      <ul className={styles.list}>
        {tasks.map((task) => (
          <li className={styles.elem} key={nanoid()}>
            <Square size={13} />
            {task}
          </li>
        ))}
      </ul>
      <button className={styles.button} type="submit" onClick={handleClose}>
        Créer
      </button>
    </ModalContainer>
  );
}

export default AddListForm;
