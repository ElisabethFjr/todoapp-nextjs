"use client";

import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import DOMPurify from "dompurify";
import ModalContainer from "../modalContainer/ModalContainer";
import { GripVertical, Plus, XLg } from "react-bootstrap-icons";
import { Task } from "@/@types";
import styles from "./AddListForm.module.scss";

interface AddListFormProps {
  closeModal: (value: React.SetStateAction<boolean>) => void;
}

function AddListForm({ closeModal }: AddListFormProps) {
  //---VARIABLES----
  // Declaration states
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [title, setTitle] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskValue, setTaskValue] = useState<string>("");

  // Declaration task input ref
  const taskInputRef = useRef<HTMLInputElement>(null);

  //---HANDLING FUNCTIONS----
  // Handle Change title input value
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = DOMPurify.sanitize(event.target.value);
    setTitle(sanitizedValue);
  };

  // Handle Change task input value
  const handleTaskChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = DOMPurify.sanitize(event.target.value);
    setTaskValue(sanitizedValue);
  };

  // Handle Edit text of a created task
  const handleTaskTextChange = (id: string, newText: string) => {
    const sanitizedText = DOMPurify.sanitize(newText);
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, text: sanitizedText } : task
      )
    );
  };

  // Handle Delete a task from the list
  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  // Handle Add a new task in the list
  const handleAddTask = () => {
    if (!taskValue.trim()) return;
    const newTask: Task = {
      id: uuidv4(),
      text: taskValue,
      is_completed: false,
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setTaskValue("");
  };

  // Handle Focus task input when Enter key pressed
  const handleEnterPressFocusTask = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (taskInputRef.current) {
        taskInputRef.current.focus();
      }
    }
  };

  // Handle Add a new task when Enter key pressed
  const handleEnterPressAddTask = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddTask();
    }
  };

  // Handle PreventDefault Form on key press "Enter"
  const handleFormKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    let tasksArray: string[] = [];
    if (tasks && tasks.length > 0) {
      tasksArray = tasks.map((task) => task.text);
    }

    const formDataJSON = JSON.stringify({
      title: title,
      tasks: tasksArray.length > 0 ? tasksArray : null,
    });
    console.log(formDataJSON);
    // Reset the form
    setTitle("");
    setTasks([]);
    closeModal(true);
  };

  // Handle closing modal
  const handleClose = () => {
    setIsOpen(!isOpen);
    closeModal(true);
  };

  return (
    <ModalContainer handleClose={handleClose}>
      <form
        className={styles.form}
        onSubmit={handleSubmit}
        onKeyDown={handleFormKeyPress}
      >
        {/* Add Title Section */}
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
            onKeyDown={handleEnterPressFocusTask} // Handle Enter key press to move focus to task input
            required
          />
        </div>
        {/* Add Task Section */}
        <div className={styles.addtask}>
          <label className={styles.label} htmlFor="task">
            <Plus />
          </label>
          <input
            ref={taskInputRef} // Reference to the task input
            className={styles.input}
            id="task"
            name="task"
            type="text"
            placeholder="Nouvelle tâche"
            value={taskValue}
            onChange={handleTaskChange}
            onKeyDown={handleEnterPressAddTask} // Handle Enter key press to add a new task in the list
          />
        </div>
        {/* Tasks List Section + Edit/Delete task */}
        <ul className={styles.tasks}>
          {tasks.map((task) => (
            <li className={styles.task} key={task.id}>
              <input className={styles.checkbox} type="checkbox" disabled />
              <input
                className={styles.text}
                type="text"
                value={task.text}
                onChange={(e) => handleTaskTextChange(task.id, e.target.value)}
              />
              <button
                type="button"
                className={styles.delete}
                onClick={() => handleDeleteTask(task.id)}
                aria-label="Supprimer la tâche"
                title="Supprimer"
              >
                <XLg className={styles.icon} size={15} />
              </button>
              <GripVertical className={styles.grip} size={20} color="#c4a1ff" />
            </li>
          ))}
        </ul>
        {/* Button Form Submission */}
        <button className={styles.button} type="submit">
          Créer
        </button>
      </form>
    </ModalContainer>
  );
}

export default AddListForm;
