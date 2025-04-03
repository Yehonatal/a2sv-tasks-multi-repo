import { getTasks, saveTasks } from "./storage.js";
import { renderTasks } from "./renderer.js";

import { editTask as edit, completeTask as complete, deleteTask as del } from "./task-actions.js";

export function setupTaskEventListeners(): void {
    document.getElementById("taskList")?.addEventListener("click", (e: Event) => {
        const target = e.target as HTMLElement;
        const taskItem = target.closest(".task-item") as HTMLElement || null;
        if (!taskItem || !taskItem.dataset.id) return;

        const taskId = Number(taskItem.dataset.id);

        if (target.classList.contains("js-edit-task")) {
            edit(taskId);
        } else if (target.classList.contains("js-complete-task")) {
            complete(taskId); 
        } else if (target.classList.contains("js-delete-task")) {
            del(taskId);
        }
    })

}