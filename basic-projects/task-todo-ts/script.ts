import { createTask } from "./src/task.js";
import { getTasks, saveTasks } from "./src/storage.js";
import { renderTasks } from "./src/renderer.js";
import { setupTaskEventListeners } from "./src/event-handler.js";
import { Task } from "./src/task.js";

const tasks: Task[] = getTasks();
renderTasks(tasks);

// Notification interface
interface Toast {
    message: string;
    type: "success" | "error" | "warning" | "info";
}

function showToast(message: Toast) {
    const toast = document.getElementById("toast") as HTMLElement;
    toast.textContent = message.message;
    toast.className = `toast toast--show toast--${message.type}`;

    setTimeout(() => {
        toast.className = toast.className.replace("toast--show","");
    }, 3000);
}

// Handling the Events 
(document.getElementById("addTaskButton") as HTMLElement)?.addEventListener("click", () => {
    const taskTitleInput = document.getElementById("taskTitle") as HTMLInputElement;
    const taskDescriptionInput = document.getElementById("taskDescription") as HTMLInputElement;
    const taskDeadlineInput = document.getElementById("taskDeadline") as HTMLInputElement;

    if (taskTitleInput.value === "" || taskDescriptionInput.value === "" || taskDeadlineInput.value === "") {
        showToast({message: "Please fill in all the fields", type: "error"});
        return;
    }

    const taskTitle = taskTitleInput.value.trim();
    const taskDescription = taskDescriptionInput.value.trim();
    const taskDeadline = taskDeadlineInput.value;

    if (!taskTitle) {
        showToast({message: "Please enter a valid task title", type: "error"});
        return;
    }
    if (!taskDescription) {
        showToast({message: "Please enter a valid task description", type: "error"});
        return;
    }
    if (!taskDeadline) {
        showToast({message: "Please enter a valid task deadline", type: "error"});
        return;
    }

    const task: Task = createTask(taskTitle, taskDescription, taskDeadline);
    const tasks: Task[] = getTasks();
    tasks.push(task);
    saveTasks(tasks);
    renderTasks(tasks);
    showToast({message: "Task added successfully", type: "success"});

    clearInputs(taskTitleInput, taskDescriptionInput, taskDeadlineInput);
})

function clearInputs(...inputs: HTMLInputElement[]) {
    inputs.forEach((input) => {
       input.value = ''
   })
}

// Setup Event Listeners
setupTaskEventListeners();
