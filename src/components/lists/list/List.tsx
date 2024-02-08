"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { List, Task } from "@/@types";
import TaskInProgress from "./taskInProgress/TaskInProgress";
import TaskDone from "./taskDone/TaskDone";
import PaletteColor from "@/components/modals/paletteColor/PaletteColor";
import EditListForm from "@/components/modals/editListForm/EditListForm";
import { Palette, Pencil, XLg } from "react-bootstrap-icons";
import styles from "./List.module.scss";

interface ListProps {
  list: List;
  setListData: Dispatch<SetStateAction<List[]>>;
}

function List({ list, setListData }: ListProps) {
  const [tasks, setTasks] = useState<Task[]>(list.tasks);
  const [isOpenEditListModal, setIsOpenEditListModal] =
    useState<boolean>(false);
  const [isOpenPaletteColor, setIsOpenPaletteColor] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>("#ffffff");

  // Handle Click to toggle the EditListForm modal
  const handleOpenEditModal = () => {
    setIsOpenEditListModal(!isOpenEditListModal);
  };

  // Handle Click to toggle the PaletteColor
  const handleOpenPaletteColor = () => {
    setIsOpenPaletteColor(!isOpenPaletteColor);
  };

  // Handle Click to select color in the PaletteColor
  const handleSelectColor = (color: string) => {
    setSelectedColor(color);
  };

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
    <article className={styles.card} style={{ backgroundColor: selectedColor }}>
      <h2 className={styles.title}>{list.title}</h2>
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
      <div
        className={`${styles.icons} ${
          isOpenPaletteColor ? styles.selected : ""
        }`}
      >
        <button
          className={`${styles.icon} ${styles.palette}`}
          type="button"
          onClick={handleOpenPaletteColor}
        >
          <Palette size={18} title="Options d'arrière plan" />
        </button>
        <button
          className={styles.icon}
          type="button"
          onClick={handleOpenEditModal}
        >
          <Pencil size={18} title="Editer la liste" />
        </button>
        <button className={styles.icon} type="button">
          <XLg size={18} title="Supprimer la liste" />
        </button>
      </div>
      {isOpenPaletteColor && (
        <PaletteColor
          onSelectColor={handleSelectColor}
          selectedColor={selectedColor}
        />
      )}
      {isOpenEditListModal && (
        <EditListForm
          list={list}
          updateListData={setListData}
          closeModal={() => setIsOpenEditListModal(false)}
        />
      )}
    </article>
  );
}

export default List;
