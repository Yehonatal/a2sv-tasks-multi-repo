import { TaskProps } from "../types/TaskProps";
import { STORAGE_KEY } from "../types/keys";

export function getTasks(): TaskProps[] {
  const tasks = localStorage.getItem(STORAGE_KEY);
  return tasks ? JSON.parse(tasks) as TaskProps[] : [];
}
