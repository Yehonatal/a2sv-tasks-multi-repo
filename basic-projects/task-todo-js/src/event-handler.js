import { getTasks, saveTasks } from "./storage.js";
import { renderTasks } from "./renderer.js";
import {
    editTask as edit,
    completeTask as complete,
    deleteTask as del,
} from "./task-actions.js";

export function setupTaskEventListeners() {
    document.getElementById("taskList").addEventListener("click", function (e) {
        const taskId = e.target.closest(".task-item").dataset.id;

        if (e.target.classList.contains("js-edit-task")) {
            edit(taskId);
        } else if (e.target.classList.contains("js-complete-task")) {
            complete(taskId);
        } else if (e.target.classList.contains("js-delete-task")) {
            del(taskId);
        }
    });
}
