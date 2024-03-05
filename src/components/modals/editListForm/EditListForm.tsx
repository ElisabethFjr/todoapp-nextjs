"use client";

import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { deleteTask, updateList } from "@/lib/api";
import {
  Check,
  ChevronDown,
  GripVertical,
  Plus,
  XLg,
} from "react-bootstrap-icons";
import { List, Task } from "@/@types";
import styles from "./EditListForm.module.scss";

interface EditListFormProps {
  list: List;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  editListModalRef: RefObject<HTMLDivElement>;
  setTasks: Dispatch<SetStateAction<Task[]>>;
  setTitle: Dispatch<SetStateAction<string>>;
}

function EditListForm({
  list,
  isOpen,
  setIsOpen,
  editListModalRef,
  setTasks,
  setTitle,
}: EditListFormProps) {
  //---VARIABLES----
  // --- HOOKS ---
  const router = useRouter();

  // Declaration states
  const [formTitle, setFormTitle] = useState<string>(list.title);
  const [taskValue, setTaskValue] = useState<string>("");
  const [formTasks, setFormTasks] = useState<Task[]>(list.tasks);
  const [showModal, setShowModal] = useState(false);

  // Declaration task input ref
  const taskInputRef = useRef<HTMLInputElement>(null); // Ref for task input

  //---HANDLING FUNCTIONS----
  // Handle Change title input value
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormTitle(event.target.value);
  };

  // Handle Change task input value
  const handleTaskChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskValue(event.target.value);
  };

  // Handle Edit text of a created task
  const handleTaskTextChange = (id: string, newText: string) => {
    setFormTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, text: newText } : task
      )
    );
  };

  // Handle Delete a task from the list
  const handleDeleteTask = async (id: string) => {
    const updatedTasks = formTasks.filter((task) => task.id !== id);
    // Fetch api to delete the task
    await deleteTask(list.id, id);
    setFormTasks(updatedTasks);
  };

  // Handle Add a new task in the list
  const handleAddTask = () => {
    if (!taskValue.trim()) return;
    const newTask: Task = {
      id: uuidv4(),
      text: taskValue,
      is_completed: false,
    };
    const updatedTasks = [...formTasks, newTask];
    setFormTasks(updatedTasks);
    setTaskValue("");
  };

  // Handle Task checkbox change
  const handleToggleTask = (taskId: string) => {
    const updatedTasks = formTasks.map((task) =>
      task.id === taskId ? { ...task, is_completed: !task.is_completed } : task
    );
    console.log(updatedTasks);
    setFormTasks(updatedTasks);
  };

  // Focus task input when Enter key pressed
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

  // Add a new task when Enter key pressed
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
  // Handle Close the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Get updated title
    const updatedTitle = formTitle;
    // Get all updated tasks
    const updatedTasks = formTasks.map((task: Task) => ({
      id: task.id,
      text: task.text,
      is_completed: task.is_completed,
    }));
    // Convert form data to JSON
    const formDataJSON = JSON.stringify({
      title: updatedTitle,
      tasks: updatedTasks && updatedTasks.length > 0 ? formTasks : null,
    });
    // Fetch api PATCH to update the list data
    await updateList(list.id, formDataJSON);
    // Update tasks state on List Component
    setTitle(updatedTitle);
    setTasks(updatedTasks);
    // Close the modal and then refresh the page
    await handleCloseModal();
    router.refresh();
  };

  // Filter In Progress Tasks
  const inProgressTasks = formTasks.filter((task) => !task.is_completed);
  // Filter Completed Tasks
  const completedTasks = formTasks.filter((task) => task.is_completed);
  const completedTasksCount = completedTasks.length; // Get the number of completed tasks
  const completedTasksText =
    completedTasksCount === 1 ? "tâche terminée" : "tâches terminées"; // Determine the appropriate text based on the number of completed tasks

  return (
    <div className={styles.background}>
      <div
        className={`${styles.container} ${
          list.color ? styles.container : styles.white
        } ${showModal ? styles.openAnimation : styles.closeAnimation}`}
        style={{ backgroundColor: list.color }}
        ref={editListModalRef}
      >
        <form
          className={styles.form}
          onSubmit={handleSubmit}
          onKeyDown={handleFormKeyPress}
        >
          {/* Edit Title Section */}
          <div className={styles.title}>
            <label className={styles.label} htmlFor="title" />
            <input
              className={styles.input}
              id="title"
              name="title"
              type="text"
              placeholder="Titre"
              value={formTitle}
              onChange={handleTitleChange}
              onKeyDown={handleEnterPressFocusTask} // Handle Enter key press to move focus to task input
              required
            />
          </div>

          {/* Add Task section */}
          <div className={styles.addtask}>
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
              onKeyDown={handleEnterPressAddTask} // Handle Enter key press to add a new task in the list
            />
          </div>

          {/* In Progress Tasks section + Edit/Delete task */}
          {inProgressTasks.length > 0 && (
            <div className={styles.inprogress}>
              <ul className={styles.tasks}>
                {inProgressTasks.map((task: Task) => (
                  <li className={styles.task} key={task.id}>
                    <input
                      className={styles.checkbox}
                      id={task.id}
                      type="checkbox"
                      onChange={() => handleToggleTask(task.id)}
                      checked={task.is_completed}
                    />
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
            </div>
          )}

          {/* Completed Tasks section + Delete task */}
          {completedTasks.length > 0 && (
            <div
              className={`${
                completedTasksCount === formTasks.length
                  ? `${styles.completed} ${styles.reset}`
                  : styles.completed
              }`}
            >
              <div className={styles.description}>
                <ChevronDown className={styles.arrow} size={12} />
                <p className={styles.text}>
                  {completedTasksCount} {completedTasksText}.
                </p>
              </div>
              <ul className={styles.tasks}>
                {completedTasks.map((task: Task) => (
                  <li className={styles.task} key={task.id}>
                    <input
                      className={styles.checkbox}
                      id={task.id}
                      type="checkbox"
                      onChange={() => handleToggleTask(task.id)}
                      checked={task.is_completed}
                    />
                    <label className={styles.text}>{task.text}</label>
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
                    <Check className={styles.check} color="#5f6368" size={15} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Button Form Submission */}
          <button className={styles.button} type="submit">
            Valider
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

export default EditListForm;
