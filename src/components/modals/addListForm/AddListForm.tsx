"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import DOMPurify from "dompurify";
import { addList } from "@/lib/api";
import { GripVertical, Plus, XLg } from "react-bootstrap-icons";
import { Task } from "@/@types";
import styles from "./AddListForm.module.scss";

function AddListForm() {
  // --- HOOKS ---
  const router = useRouter();

  //---VARIABLES----
  // Declaration states
  const [title, setTitle] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskValue, setTaskValue] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

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

  // Show the modal
  useEffect(() => {
    setShowModal(true);
  }, []);
  // Handle Close Add List Modal
  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => {
      router.back(); // Close the modal
    }, 300);
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Get the title and check if not empty
    const title = formData.get("title") as string;
    if (!title.trim()) return;

    const formDataJSON = JSON.stringify({
      title: title,
      tasks: tasks && tasks.length > 0 ? tasks : null,
    });

    // Fetch Api
    await addList(formDataJSON);
    // Close modal and remove search param
    await handleCloseModal();
    router.refresh();
  };

  return (
    <div className={styles.background}>
      <div
        className={`${styles.container} ${
          showModal ? styles.openAnimation : styles.closeAnimation
        }`}
      >
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
                  onChange={(e) =>
                    handleTaskTextChange(task.id, e.target.value)
                  }
                  required
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
                <GripVertical
                  className={styles.grip}
                  size={20}
                  color="#c4a1ff"
                />
              </li>
            ))}
          </ul>
          {/* Button Form Submission */}
          <button className={styles.button} type="submit">
            Créer
          </button>
        </form>
        <button
          type="button"
          className={styles.close}
          onClick={handleCloseModal}
          aria-label="Fermer la modale"
          title="Fermer"
        >
          <XLg className={styles.icon} size={18} />
        </button>
      </div>
    </div>
  );
}

export default AddListForm;
