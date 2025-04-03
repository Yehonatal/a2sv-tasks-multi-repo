import { editTask as edit, completeTask as complete, deleteTask as del } from "./task-actions.js";
export function setupTaskEventListeners() {
    var _a;
    (_a = document.getElementById("taskList")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (e) => {
        const target = e.target;
        const taskItem = target.closest(".task-item") || null;
        if (!taskItem || !taskItem.dataset.id)
            return;
        const taskId = Number(taskItem.dataset.id);
        if (target.classList.contains("js-edit-task")) {
            edit(taskId);
        }
        else if (target.classList.contains("js-complete-task")) {
            complete(taskId);
        }
        else if (target.classList.contains("js-delete-task")) {
            del(taskId);
        }
    });
}
