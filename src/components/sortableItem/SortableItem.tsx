import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemProps {
  id: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

function SortableItem({ id, className, style, children }: SortableItemProps) {
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
  const itemStyle = {
    ...style,
    transform: CSS.Transform.toString(adjustedTransform),
  };

  return (
    <div
      className={className} // Custom className
      ref={setNodeRef} // Set a reference to the list item node
      style={itemStyle} // Apply the item & transform style
      {...attributes} // Spread attributes for DnD (aria, tabIndex,...)
      {...listeners} // Spread event listerners for DnD
    >
      {children}
    </div>
  );
}

export default SortableItem;
