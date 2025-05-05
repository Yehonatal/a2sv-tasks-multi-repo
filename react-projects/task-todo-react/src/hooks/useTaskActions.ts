import { getTasks } from "../hooks/useGetTasks";
import { saveTasks } from "./useSave.js";
import { TaskProps } from "../types/TaskProps";

export function completeTask(taskId: number): void {
    const tasks: TaskProps[] = getTasks();
    const task = tasks.find((task) => task.id === taskId);
    if (!task) return;
    task.completed = !task.completed;

    saveTasks(tasks);
}

export function deleteTask(taskId: number): void {
    let tasks: TaskProps[] = getTasks();
    tasks = tasks.filter((task) => task.id !== taskId);
    saveTasks(tasks);
}

export function editTask(taskId: number): void {
    const tasks: TaskProps[] = getTasks();
    const task = tasks.find((task) => task.id === taskId);
    if (!task) return;

    (document.getElementById("taskTitle") as HTMLInputElement).value =
        task.title;
    (document.getElementById("taskDescription") as HTMLInputElement).value =
        task.description;
    (document.getElementById("taskDeadline") as HTMLInputElement).value =
        task.deadline;

    deleteTask(taskId);
}
