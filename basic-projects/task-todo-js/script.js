// Initializing the task list from local storage
const tasks = getTasks();
renderTasks(tasks);

// Next step
document.getElementById("addTaskButton").addEventListener("click", function () {
    const taskTitle = document.getElementById("taskTitle");
    const taskDescription = document.getElementById("taskDescription");
    const taskDeadline = document.getElementById("taskDeadline");

    const task = {
        id: Date.now(),
        title: taskTitle.value,
        description: taskDescription.value,
        deadline: taskDeadline.value,
        completed: false, // default state
    };

    taskTitle.value = "";
    taskDescription.value = "";
    taskDeadline.value = "";

    const tasks = getTasks();
    tasks.push(task);
    saveTasks(tasks);
    renderTasks(tasks);
});

function getTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    return tasks;
}

function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(tasks) {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // Clear the existing list

    tasks.forEach((task) => {
        taskList.innerHTML += `
      <div class="task_item ${
          task.completed ? "task_completed" : ""
      }" data-id="${task.id}">
        <div class="task_item_header">
          <h3>${task.title}</h3>
          <span class="task_deadline">Deadline: ${task.deadline}</span>
        </div>
        <p>${task.description}</p>
        <div class="task_card_control">
          <button class="edit_task_button edit_task_btn">Edit</button>
          <button class="complete_task_button comp_task_btn">${
              task.completed ? "Not Complete" : "Complete"
          }</button>
          <button class="delete_task_button del_task_btn">Delete</button>
        </div>
      </div>
    `;
    });
}

// Event delegation for task actions
document.getElementById("taskList").addEventListener("click", function (e) {
    const tasks = getTasks();
    const taskId = e.target.closest(".task_item").getAttribute("data-id");

    if (e.target.classList.contains("edit_task_button")) {
        editTask(taskId);
    } else if (e.target.classList.contains("complete_task_button")) {
        completeTask(taskId);
    } else if (e.target.classList.contains("delete_task_button")) {
        deleteTask(taskId);
    }
});

function editTask(taskId) {
    const tasks = getTasks();
    const task = tasks.find((task) => task.id == taskId);

    document.getElementById("taskTitle").value = task.title;
    document.getElementById("taskDescription").value = task.description;
    document.getElementById("taskDeadline").value = task.deadline;

    deleteTask(taskId);
}

function completeTask(taskId) {
    const tasks = getTasks();
    const task = tasks.find((task) => task.id == taskId);
    task.completed = !task.completed;

    saveTasks(tasks);
    renderTasks(tasks);
}

function deleteTask(taskId) {
    let tasks = getTasks();
    tasks = tasks.filter((task) => task.id != taskId);
    saveTasks(tasks);
    renderTasks(tasks);
}
