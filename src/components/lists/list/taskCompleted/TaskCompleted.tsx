import { Task } from "@/@types";
import styles from "./TaskCompleted.module.scss";
import { Check } from "react-bootstrap-icons";

interface TaskCompletedProps {
  task: Task;
  handleToggleTask: (taskId: string) => void;
}

function TasCompleted({ task, handleToggleTask }: TaskCompletedProps) {
  return (
    <li className={styles.task} key={task.id}>
      <input
        className={styles.checkbox}
        id={task.id}
        type="checkbox"
        onChange={() => handleToggleTask(task.id)}
        checked={task.is_completed}
      />
      <label className={styles.label} htmlFor={task.id}>
        {task.text}
      </label>
      <Check className={styles.check} color="#5f6368" size={15} />
    </li>
  );
}

export default TasCompleted;
