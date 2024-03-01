"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import SortableList from "./sortableList/SortableList";
import List from "./list/List";
import NoList from "./noList/NoList";
import { List as ListType } from "@/@types";
import { updatePositionsList } from "@/lib/api";
import styles from "./Lists.module.scss";

interface ListsProps {
  lists: ListType[];
}

function Lists({ lists }: ListsProps) {
  // ---VARIABLES----
  // Declaration states
  const [listsData, setListsData] = useState<ListType[]>(lists);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // --- HOOKS ---
  // Update Lists Components when lists prop changes
  useEffect(() => {
    setListsData(lists);
  }, [lists]);

  // --- DRAG N DROP (Dnd-kit)---
  // Initializing drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor), // Mouse sensor
    useSensor(KeyboardSensor) // Keyboard sensor
  );

  // Handle Drag Start Event
  const handleDragStart = () => {
    setIsDragging(true);
  };

  // Handle Drag End Event
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    // Check if any of the required variables are missing or if the active and over elements are the same
    if (
      !active || // If no active draggable list
      !over || // If there is no droppable container
      active.id === null || // If the active draggable list has no id
      over.id === null || // If the droppable container has no id
      active.id === over.id // If the active draggable list and the droppable container are the same
    ) {
      setIsDragging(false); // Reset dragging state
      return;
    }

    // Find array index of the active dragged list
    const oldIndex = listsData.findIndex((list) => list.id === active.id);
    // Find new array index of the dropped list
    const newIndex = listsData.findIndex((list) => list.id === over.id);
    // Reorganise each list's position based on the new array order
    const updatedLists = arrayMove(listsData, oldIndex, newIndex).map(
      (list, index) => ({
        ...list,
        position: index + 1,
      })
    );
    setIsDragging(false); // Reset dragging state
    setListsData(updatedLists); // Update Lists data with new order
    await updatePositionsList(updatedLists); // Call Api to update each list's position in database
  };

  return (
    // Wrap Lists to add Drag and Drop Context to the component
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Add Sortable Context */}
      <SortableContext
        items={listsData.map((list) => list.id)}
        strategy={rectSortingStrategy}
      >
        <div className={styles.container}>
          {listsData.length > 0 ? (
            // If Lists array > 0, display all Sortable Lists
            <ul className={styles.lists}>
              {listsData.map((list: ListType) => (
                <SortableList key={list.id} id={list.id}>
                  <List list={list} isDragging={isDragging} />
                </SortableList>
              ))}
            </ul>
          ) : (
            // If no List, display noList component
            <div className={styles.nolist}>
              <NoList />
            </div>
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export default Lists;
