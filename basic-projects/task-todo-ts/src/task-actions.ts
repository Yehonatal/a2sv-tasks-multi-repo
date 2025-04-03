import { getTasks, saveTasks } from "./storage.js";
import { renderTasks } from "./renderer.js";
import { Task } from "./task.js";


export function completeTask(taskId: number): void {
    const tasks: Task[] = getTasks();
    const task = tasks.find((task) => task.id === taskId);
    if (!task) return;
    task.completed = !task.completed;
    
    saveTasks(tasks);
    renderTasks(tasks);

}

export function deleteTask(taskId: number): void {
    let tasks: Task[] = getTasks();
    tasks = tasks.filter(((task) => task.id !== taskId));
    saveTasks(tasks);
    renderTasks(tasks);
}

export function editTask(taskId: number): void {
    const tasks: Task[] = getTasks();
    const task = tasks.find((task) => task.id === taskId);
    if (!task) return

    (document.getElementById("taskTitle") as HTMLInputElement).value = task.title;
    (document.getElementById("taskDescription") as HTMLInputElement).value = task.description;
    (document.getElementById("taskDeadline") as HTMLInputElement).value = task.deadline;

    deleteTask(taskId);
}