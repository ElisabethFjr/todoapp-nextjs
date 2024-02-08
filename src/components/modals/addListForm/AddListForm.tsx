"use client";

import { useState } from "react";
const { v4: uuidv4 } = require("uuid");
import ModalContainer from "../modalContainer/ModalContainer";
import { GripVertical, Plus, Square, XLg } from "react-bootstrap-icons";
import { Task } from "@/@types";
import styles from "./AddListForm.module.scss";

interface AddListFormProps {
  closeModal: (value: React.SetStateAction<boolean>) => void;
}

function AddListForm({ closeModal }: AddListFormProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [title, setTitle] = useState<string>("");
  const [taskValue, setTaskValue] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);

  // Handle Change title value
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  // Handle Change task value
  const handleTaskChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskValue(event.target.value);
  };

  // Handle Edit created task text value
  const handleTaskTextChange = (id: string, newText: string) => {
    setTasks((prevTasks) =>
      prevTasks.map(
        (task) => (task.id === id ? { ...task, text: newText } : task) // If id matching with id parameter, update the task with new text
      )
    );
  };

  // Handle Delete task from the task[]
  const handleDeleteTask = (id: string) => {
    // Filter tasks to delete the task with the specified id
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  // Handle Submit form
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!taskValue.trim()) return; // Prevent adding empty tasks
    const newTask: Task = {
      id: uuidv4(),
      text: taskValue,
      is_completed: false,
    };
    setTasks([...tasks, newTask]);
    setTaskValue("");
    const formData = new FormData(event.currentTarget);
    const formDataObject = Object.fromEntries(formData.entries());
    console.log(formDataObject);
  };

  // Handle Close modal
  const handleClose = () => {
    setIsOpen(!isOpen);
    closeModal(true);
  };

  return (
    <ModalContainer handleClose={handleClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Add/Edit Title section */}
        <div className={styles.title}>
          <label className={styles.label} htmlFor="title" />
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
        {/* Add Task section */}
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
            value={taskValue}
            onChange={handleTaskChange}
          />
          <button className={styles.submit} type="submit" />
        </div>
      </form>
      {/* Tasks list section + Edit/Delete task */}
      <ul className={styles.list}>
        {tasks.map((task) => (
          <>
            <li className={styles.elem} key={task.id}>
              <input className={styles.checkbox} type="checkbox" disabled />
              <input
                className={styles.text}
                type="text"
                value={task.text}
                onChange={(e) => handleTaskTextChange(task.id, e.target.value)}
              />
              <button className={styles.submit} type="submit" />
              <button
                type="button"
                className={styles.close}
                onClick={() => handleDeleteTask(task.id)}
                aria-label="Supprimer la tâche"
                title="Supprimer"
              >
                <XLg className={styles.icon} size={15} />
              </button>
              <GripVertical className={styles.grip} size={20} color="#c4a1ff" />
            </li>
          </>
        ))}
      </ul>
      {/* Button Form Submission */}
      <button className={styles.button} type="submit" onClick={handleClose}>
        Créer
      </button>
    </ModalContainer>
  );
}

export default AddListForm;
