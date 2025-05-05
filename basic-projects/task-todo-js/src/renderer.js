export function renderTasks(tasks) {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach((task) => {
        const taskItem = document.createElement("div");
        taskItem.classList.add("task-item");
        if (task.completed) {
            taskItem.classList.add("task-item--completed");
        }
        taskItem.dataset.id = task.id;

        taskItem.innerHTML = `
      <div class="task-item__header">
        <h3 class="task-item__title">${task.title}</h3>
        <span class="task-item__deadline">${task.deadline}</span>
      </div>
      <p class="task-item__description">${task.description}</p>
      <div class="task-item__controls">
        <button class="task-item__button task-item__button--edit js-edit-task">Edit</button>
        <button class="task-item__button task-item__button--complete js-complete-task">${
            task.completed ? "Not Complete" : "Complete"
        }</button>
        <button class="task-item__button task-item__button--delete js-delete-task">Delete</button>
      </div>
    `;

        taskList.appendChild(taskItem);
    });
}
