import { Task } from "@/@types";
import styles from "./TaskInProgress.module.scss";

interface TaskInProgressProps {
  task: Task;
  handleToggleTask: (taskId: string) => void;
}

function TaskInProgress({ task, handleToggleTask }: TaskInProgressProps) {
  return (
    <li className={styles.task}>
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
    </li>
  );
}

export default TaskInProgress;
