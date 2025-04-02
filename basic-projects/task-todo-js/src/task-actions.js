import { getTasks, saveTasks } from "./storage.js";
import { renderTasks } from "./renderer.js";

export function editTask(taskId) {
    const tasks = getTasks();
    const task = tasks.find((task) => task.id == taskId);

    document.getElementById("taskTitle").value = task.title;
    document.getElementById("taskDescription").value = task.description;
    document.getElementById("taskDeadline").value = task.deadline;

    deleteTask(taskId);
}

export function completeTask(taskId) {
    const tasks = getTasks();
    const task = tasks.find((task) => task.id == taskId);
    task.completed = !task.completed;

    saveTasks(tasks);
    renderTasks(tasks);
}

export function deleteTask(taskId) {
    let tasks = getTasks();
    tasks = tasks.filter((task) => task.id != taskId);
    saveTasks(tasks);
    renderTasks(tasks);
}
