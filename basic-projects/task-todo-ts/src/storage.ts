import {Task} from "./task";
const STORAGE_KEY: string = "tasks-TS";

export function getTasks(): Task[] {
  const tasks = localStorage.getItem(STORAGE_KEY);
  return tasks ? JSON.parse(tasks) as Task[] : [];
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}