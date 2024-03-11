"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteList, updateStatusTask } from "@/lib/api";
import { List, Task } from "@/@types";
import TaskInProgress from "./taskInProgress/TaskInProgress";
import TaskCompleted from "./taskCompleted/TaskCompleted";
import PaletteColor from "@/components/modals/paletteColor/PaletteColor";
import EditListForm from "@/components/modals/editListForm/EditListForm";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Palette,
  Pencil,
  XLg,
} from "react-bootstrap-icons";
import styles from "./List.module.scss";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
// import SortableItem from "@/components/sortableItem/SortableItem";
interface ListProps {
  list: List;
  isDragging: boolean;
  id: string;
}

function List({ list, isDragging, id }: ListProps) {
  // --- HOOKS ---
  const router = useRouter();

  // --- DND HOOKS ---
  // Destructuring properties from the useSortable hook
  const { attributes, listeners, setNodeRef, transform } = useSortable({ id });

  // Adjust the transform object by setting scaleX and scaleY to 1 to avoid scaling issues
  const adjustedTransform = {
    scaleX: 1,
    scaleY: 1,
    x: transform?.x ?? 0,
    y: transform?.y ?? 0,
  };

  // Convert the transform object to a string to apply CSS style
  const style = {
    transform: CSS.Transform.toString(adjustedTransform),
  };

  // ---VARIABLES----
  // Declaration states
  const [title, setTitle] = useState<string>(list.title);
  const [tasks, setTasks] = useState<Task[]>(list.tasks);
  const [isOpenEditListModal, setIsOpenEditListModal] =
    useState<boolean>(false);
  const [isOpenPaletteColor, setIsOpenPaletteColor] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>(list.color);
  const [showCompletedTasks, setShowCompletedTasks] = useState<boolean>(false);

  // ---HANDLING FUNCTIONS----
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
  const ListRef = useRef<HTMLLIElement>(null);
  const editListModalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        (isOpenPaletteColor &&
          ListRef.current &&
          !ListRef.current.contains(event.target as Node)) ||
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
    console.log(updatedTask);
    await updateStatusTask(list.id, taskId, updatedTask.is_completed);
  };

  // Handle Delete a List
  const handleDeleteList = async () => {
    await deleteList(list.id);
    router.refresh();
  };

  // Handle Show the Completed Tasks on Chevron Button
  const handleShowCompletedTasks = () => {
    setShowCompletedTasks(!showCompletedTasks);
  };

  // Filter In Progress Tasks
  const inProgressTasks = tasks.filter((task) => !task.is_completed);
  // Filter Completed Tasks
  const completedTasks = tasks.filter((task) => task.is_completed);
  const completedTasksCount = completedTasks.length; // Get the number of completed tasks
  const completedTasksText =
    completedTasksCount === 1 ? "tâche terminée" : "tâches terminées"; // Determine the appropriate text based on the number of completed tasks

  return (
    <li
      className={`${styles.container} ${isDragging ? styles.dragging : ""}`}
      ref={ListRef}
    >
      <div className={styles.icons}>
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
      <div
        className={`${styles.card} ${isDragging ? styles.dragging : ""}`}
        style={{
          ...style,
          backgroundColor: selectedColor ? selectedColor : list.color,
        }}
        ref={setNodeRef}
      >
        <button
          className={`${styles.grab} ${isDragging ? styles.dragging : ""}`}
          {...attributes}
          {...listeners}
          type="button"
        >
          <GripVertical size={20} color="#7d7d7d" />
        </button>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.wrapper}>
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
          {completedTasks.length > 0 && (
            <>
              <button
                className={`${
                  completedTasksCount === tasks.length
                    ? `${styles.description} ${styles.reset}`
                    : styles.description
                }`}
                type="button"
                onClick={handleShowCompletedTasks}
                aria-label="Afficher les tâches complétées."
                title="Afficher les tâches complétées."
              >
                {showCompletedTasks ? (
                  <ChevronDown className={styles.chevron} size={13} />
                ) : (
                  <ChevronRight className={styles.chevron} size={13} />
                )}
                {completedTasksCount} {completedTasksText}.
              </button>
              {showCompletedTasks && (
                <ul className={styles.completed}>
                  {completedTasks.map((task: Task) => (
                    <TaskCompleted
                      key={task.id}
                      task={task}
                      handleToggleTask={handleToggleTask}
                    />
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
      {isOpenPaletteColor && (
        <PaletteColor
          onSelectColor={handleSelectColor}
          selectedColor={selectedColor}
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
          selectedColor={selectedColor}
        />
      )}
    </li>
  );
}

export default List;
