import { createTask } from "./src/task.js";
import { getTasks, saveTasks } from "./src/storage.js";
import { renderTasks } from "./src/renderer.js";
import { setupTaskEventListeners } from "./src/event-handler.js";

// Initializing the task list from local storage
const tasks = getTasks();
renderTasks(tasks);

// Notification
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = "toast toast--show";

    setTimeout(() => {
        toast.className = toast.className.replace("toast--show", "");
    }, 3000);
}

// Event listeners
document.getElementById("addTaskButton").addEventListener("click", function () {
    const taskTitleInput = document.getElementById("taskTitle");
    const taskDescriptionInput = document.getElementById("taskDescription");
    const taskDeadlineInput = document.getElementById("taskDeadline");

    const taskTitle = taskTitleInput.value;
    const taskDescription = taskDescriptionInput.value;
    const taskDeadline = taskDeadlineInput.value;

    // Validate that all fields are filled and not just whitespace
    if (!taskTitle.trim()) {
        showToast("Please enter a task title");
        return;
    }

    if (!taskDescription.trim()) {
        showToast("Please enter a task description");
        return;
    }

    if (!taskDeadline) {
        showToast("Please select a deadline");
        return;
    }

    const task = createTask(taskTitle, taskDescription, taskDeadline);

    taskTitleInput.value = "";
    taskDescriptionInput.value = "";
    taskDeadlineInput.value = "";

    const tasks = getTasks();
    tasks.push(task);
    saveTasks(tasks);
    renderTasks(tasks);

    showToast("Task added successfully!");
});

setupTaskEventListeners();
