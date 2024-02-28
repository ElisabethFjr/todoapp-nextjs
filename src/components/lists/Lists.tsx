"use client";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useState } from "react";
import List from "./list/List";
import NoList from "./noList/NoList";
import styles from "./Lists.module.scss";
import { List as ListType } from "@/@types";

interface ListsProps {
  lists: ListType[];
}

function Lists({ lists }: ListsProps) {
  const [listsData, setListsData] = useState<ListType[]>(lists);
  console.log("ListsData", listsData);

  const handleOnDragEnd = (result: DropResult) => {
    console.log("HandleDragEnd");
    const { source, destination } = result;

    console.log("Source", source);
    console.log("Destination", destination);

    if (
      !destination ||
      (destination.index === source.index &&
        destination.droppableId === source.droppableId)
    ) {
      return;
    }

    const updatedLists = Array.from(listsData);
    const [reorderedItem] = updatedLists.splice(result.source.index, 1);
    if (result.destination) {
      updatedLists.splice(result.destination.index, 0, reorderedItem);
    }
    setListsData(updatedLists);
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className={styles.container}>
        {listsData.length > 0 ? (
          <Droppable droppableId="lists">
            {(provided) => (
              <ul
                className={styles.lists}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {listsData.map((list: ListType, index: number) => (
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
