export interface Task {
  id: string;
  text: string;
  is_completed: boolean;
  is_deleted?: boolean;
}

export interface List {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}
