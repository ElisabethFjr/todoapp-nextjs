import { Task } from "@/@types";
import styles from "./TaskDone.module.scss";

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
    </li>
  );
}

export default TaskDone;
