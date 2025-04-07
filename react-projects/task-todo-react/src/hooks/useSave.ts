import { TaskProps } from "../types/TaskProps";
import { STORAGE_KEY } from "../types/keys";


export function saveTasks(tasks: TaskProps[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }