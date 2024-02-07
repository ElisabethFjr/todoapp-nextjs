"use client";

import { Task } from "@/@types";
import { useState } from "react";
import TaskInProgress from "./taskInProgress/TaskInProgress";
import TaskDone from "./taskDone/TaskDone";
import styles from "./List.module.scss";
import { Palette, Pencil, XLg } from "react-bootstrap-icons";
import PaletteColor from "@/components/modals/paletteColor/PaletteColor";

function List() {
  const [isPaletteColorOpen, setIsPaletteColorOpen] = useState<boolean>(false);

  // Handle Click to toggle the PaletteColor
  const handleOpenPaletteColor = () => {
    setIsPaletteColorOpen(!isPaletteColorOpen);
  };

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "2a8adaff-640a-4a82-92c6-92c07f49e0f9",
      text: "Tâche 1",
      is_completed: false,
    },
    {
      id: "ace99104-674e-46b6-b2e8-eb1809e27f90",
      text: "Tâche 2",
      is_completed: false,
    },
    {
      id: "8d5c31f5-7eb7-4340-a70b-7bb80f708376",
      text: "Tâche 3",
      is_completed: false,
    },
  ]);

  // Handle Task checkbox change
  const handleToggleTask = (taskId: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, is_completed: !task.is_completed } : task
    );
    setTasks(updatedTasks);
  };

  // Filter Undone Tasks
  const inProgressTasks = tasks.filter((task) => !task.is_completed);
  // Filter Done Tasks
  const completedTasks = tasks.filter((task) => task.is_completed);
  const completedTasksCount = completedTasks.length; // Get the number of completed tasks
  const completedTasksText =
    completedTasksCount === 1 ? "tâche terminée" : "tâches terminées"; // Determine the appropriate text based on the number of completed tasks

  return (
    <article className={styles.card}>
      <h2 className={styles.title}>Titre de la liste</h2>
      {/* Display all tasks in progress */}
      {inProgressTasks.length > 0 && (
        <ul className={styles.tasks}>
          {inProgressTasks.map((task: Task) => (
            <TaskInProgress
              key={task.id}
              task={task}
              handleToggleTask={handleToggleTask}
            />
          ))}
        </ul>
      )}
      {/* Display all completed tasks */}
      {completedTasks.length > 0 && (
        <>
          <p
            className={`${
              completedTasksCount === tasks.length
                ? `${styles.description} ${styles.reset}`
                : styles.description
            }`}
          >
            {completedTasksCount} {completedTasksText}.
          </p>
          <ul className={styles.completed}>
            {completedTasks.map((task: Task) => (
              <TaskDone
                key={task.id}
                task={task}
                handleToggleTask={handleToggleTask}
              />
            ))}
          </ul>
        </>
      )}
      <div className={styles.icons}>
        <button
          className={`${styles.icon} ${styles.palette}`}
          type="button"
          onClick={handleOpenPaletteColor}
        >
          <Palette size={18} title="Options d'arrière plan" />
        </button>
        <button className={styles.icon} type="button">
          <Pencil size={18} title="Editer la liste" />
        </button>
        <button className={styles.icon} type="button">
          <XLg size={18} title="Supprimer la liste" />
        </button>
      </div>
      {isPaletteColorOpen && (
        <PaletteColor onSelectColor={(color) => console.log(color)} />
      )}
    </article>
  );
}

export default List;
