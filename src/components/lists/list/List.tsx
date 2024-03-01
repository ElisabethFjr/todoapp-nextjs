"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  deleteList,
  getAllTasks,
  getListById,
  updateStatusTask,
} from "@/lib/api";
import { List, Task } from "@/@types";
import TaskInProgress from "./taskInProgress/TaskInProgress";
import TaskCompleted from "./taskCompleted/TaskCompleted";
import PaletteColor from "@/components/modals/paletteColor/PaletteColor";
import EditListForm from "@/components/modals/editListForm/EditListForm";
import { Palette, Pencil, XLg } from "react-bootstrap-icons";
import styles from "./List.module.scss";
interface ListProps {
  list: List;
}

function List({ list }: ListProps) {
  // --- HOOKS ---
  const router = useRouter();

  //---VARIABLES----
  // Declaration states
  const [title, setTitle] = useState<string>(list.title);
  const [tasks, setTasks] = useState<Task[]>(list.tasks);
  const [isOpenEditListModal, setIsOpenEditListModal] =
    useState<boolean>(false);

  const [isOpenPaletteColor, setIsOpenPaletteColor] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>("");

  //---HANDLING FUNCTIONS----
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

  // Handle Click outside to close modals
  const paletteColorRef = useRef<HTMLFormElement>(null);
  const editListModalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        (isOpenPaletteColor &&
          paletteColorRef.current &&
          !paletteColorRef.current.contains(event.target as Node)) ||
        (isOpenEditListModal &&
          editListModalRef.current &&
          !editListModalRef.current.contains(event.target as Node))
      ) {
        setIsOpenPaletteColor(false);
        setIsOpenEditListModal(false);
      }
    }

    if (isOpenEditListModal || isOpenPaletteColor) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenEditListModal, isOpenPaletteColor]);

  // Handle Task checkbox change
  const handleToggleTask = async (taskId: string) => {
    // Client : Update tasks by toggle is_completed status if task checkbox is clicked
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, is_completed: !task.is_completed } : task
    );
    setTasks(updatedTasks);
    // Server : Find the task by taskId & Update the is_completed status of the task
    const taskToUpdate = tasks.find((task) => task.id === taskId);
    const updatedTask = {
      ...taskToUpdate,
      is_completed: !taskToUpdate?.is_completed,
    };
    // Call API to update the task's is_completed status
    await updateStatusTask(list.id, taskId, updatedTask.is_completed);
  };

  // Filter In Progress Tasks
  const inProgressTasks = tasks.filter((task) => !task.is_completed);
  // Filter Completed Tasks
  const completedTasks = tasks.filter((task) => task.is_completed);
  const completedTasksCount = completedTasks.length; // Get the number of completed tasks
  const completedTasksText =
    completedTasksCount === 1 ? "tâche terminée" : "tâches terminées"; // Determine the appropriate text based on the number of completed tasks

  // Handle Delete a List
  const handleDeleteList = async () => {
    await deleteList(list.id);
    router.refresh();
  };

  return (
    <article
      className={styles.card}
      style={{ backgroundColor: selectedColor ? selectedColor : list.color }}
    >
      {/* Title Section */}
      <h2 className={styles.title}>{title}</h2>
      {/* In Progress Task Section */}
      {inProgressTasks.length > 0 && (
        <ul className={styles.inprogress}>
          {inProgressTasks.map((task: Task) => (
            <TaskInProgress
              key={task.id}
              task={task}
              handleToggleTask={handleToggleTask}
            />
          ))}
        </ul>
      )}
      {/* Completed Task Section */}
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
              <TaskCompleted
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
          <Palette size={16} title="Options d'arrière plan" />
        </button>
        <button
          className={styles.icon}
          type="button"
          onClick={handleOpenEditModal}
        >
          <Pencil size={16} title="Editer la liste" />
        </button>
        <button
          className={styles.icon}
          type="button"
          onClick={handleDeleteList}
        >
          <XLg size={16} title="Supprimer la liste" />
        </button>
      </div>
      {/* Modals */}
      {isOpenPaletteColor && (
        <PaletteColor
          onSelectColor={handleSelectColor}
          selectedColor={selectedColor}
          paletteColorRef={paletteColorRef}
          listId={list.id}
        />
      )}
      {isOpenEditListModal && (
        <EditListForm
          list={list}
          isOpen={isOpenEditListModal}
          setIsOpen={setIsOpenEditListModal}
          editListModalRef={editListModalRef}
          setTasks={setTasks}
          setTitle={setTitle}
        />
      )}
    </article>
  );
}

export default List;
