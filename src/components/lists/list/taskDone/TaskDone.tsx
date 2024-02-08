import { Task } from "@/@types";
import styles from "./TaskDone.module.scss";
import { Check } from "react-bootstrap-icons";

interface TaskDoneProps {
  task: Task;
  handleToggleTask: (taskId: string) => void;
}

function TaskDone({ task, handleToggleTask }: TaskDoneProps) {
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
      <Check className={styles.check} color="#5f6368" size={14} />
    </li>
  );
}

export default TaskDone;
