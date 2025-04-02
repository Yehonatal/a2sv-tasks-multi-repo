const STORAGE_KEY = "tasks";

export function getTasks() {
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    return tasks;
}

export function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
