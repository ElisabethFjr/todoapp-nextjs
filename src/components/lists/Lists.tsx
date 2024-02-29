"use client";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import List from "./list/List";
import NoList from "./noList/NoList";
import styles from "./Lists.module.scss";
import { List as ListType } from "@/@types";
import { updatePositionsList } from "@/lib/api";

interface ListsProps {
  lists: ListType[];
}

function Lists({ lists }: ListsProps) {
  // ---VARIABLES----
  // Declaration List Data state
  const [listsData, setListsData] = useState<ListType[]>(lists);

  // ---HANDLING FUNCTIONS----
  // Handle Drag and Drop reordering
  const handleOnDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    // If no destination or list's position doesn't change, return
    if (
      !destination ||
      (destination.index === source.index &&
        destination.droppableId === source.droppableId)
    ) {
      return;
    }

    // Clone the actual listsData Array
    const updatedLists = Array.from(listsData);
    // Remove the dragged list from its original position
    const [reorderedItem] = updatedLists.splice(result.source.index, 1);
    // Insert the dragged list into the new position
    updatedLists.splice(destination.index, 0, reorderedItem);

    // Reorganise each list's position based on the new array order
    updatedLists.forEach((item, index) => {
      item.position = index + 1;
    });
    // Update State with new order listsData
    setListsData(updatedLists);
    // Call Api to update position in database
    await updatePositionsList(updatedLists);
  };

  // --- HOOKS ---
  // Update de Lists Components when lists prop changes
  useEffect(() => {
    setListsData(lists);
  }, [lists]);

  return (
    // Wrap Lists to add Drag and Drop Context to the component
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className={styles.container}>
        {listsData.length > 0 ? (
          // Make the Lists <ul> a Droppable area
          <Droppable droppableId="lists" type="COLUMN" direction="horizontal">
            {(provided) => (
              <ul
                className={styles.lists}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {listsData.map((list: ListType, index: number) => (
                  // Make all List elem Draggable
                  <Draggable
                    key={list.id}
                    draggableId={list.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <List list={list} />
                      </li>
                    )}
                  </Draggable>
                ))}
                {/* Add the placeholder from React Beautiful DnD */}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        ) : (
          <div className={styles.nolist}>
            <NoList />
          </div>
        )}
      </div>
    </DragDropContext>
  );
}

export default Lists;
