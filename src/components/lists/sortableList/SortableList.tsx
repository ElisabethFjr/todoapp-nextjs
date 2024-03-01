import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "./SortableList.module.scss";

interface SortableListProps {
  id: string;
  children: React.ReactNode;
}

function SortableList({ id, children }: SortableListProps) {
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

  return (
    <li
      className={styles.sortable}
      ref={setNodeRef} // Set a reference to the list item node
      style={style} // Apply the transform style
      {...attributes} // Spread attributes for DnD (aria, tabIndex,...)
      {...listeners} // Spread event listerners for DnD
    >
      {children}
    </li>
  );
}

export default SortableList;
