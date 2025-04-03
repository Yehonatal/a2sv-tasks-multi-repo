var _a;
import { createTask } from "./src/task.js";
import { getTasks, saveTasks } from "./src/storage.js";
import { renderTasks } from "./src/renderer.js";
import { setupTaskEventListeners } from "./src/event-handler.js";
const tasks = getTasks();
renderTasks(tasks);
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message.message;
    toast.className = `toast toast--show toast--${message.type}`;
    setTimeout(() => {
        toast.className = toast.className.replace("toast--show", "");
    }, 3000);
}
// Handling the Events 
(_a = document.getElementById("addTaskButton")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    const taskTitleInput = document.getElementById("taskTitle");
    const taskDescriptionInput = document.getElementById("taskDescription");
    const taskDeadlineInput = document.getElementById("taskDeadline");
    if (taskTitleInput.value === "" || taskDescriptionInput.value === "" || taskDeadlineInput.value === "") {
        showToast({ message: "Please fill in all the fields", type: "error" });
        return;
    }
    const taskTitle = taskTitleInput.value.trim();
    const taskDescription = taskDescriptionInput.value.trim();
    const taskDeadline = taskDeadlineInput.value;
    if (!taskTitle) {
        showToast({ message: "Please enter a valid task title", type: "error" });
        return;
    }
    if (!taskDescription) {
        showToast({ message: "Please enter a valid task description", type: "error" });
        return;
    }
    if (!taskDeadline) {
        showToast({ message: "Please enter a valid task deadline", type: "error" });
        return;
    }
    const task = createTask(taskTitle, taskDescription, taskDeadline);
    const tasks = getTasks();
    tasks.push(task);
    saveTasks(tasks);
    renderTasks(tasks);
    showToast({ message: "Task added successfully", type: "success" });
    clearInputs(taskTitleInput, taskDescriptionInput, taskDeadlineInput);
});
function clearInputs(...inputs) {
    inputs.forEach((input) => {
        input.value = '';
    });
}
// Setup Event Listeners
setupTaskEventListeners();
