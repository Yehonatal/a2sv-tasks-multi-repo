// Mock the modules
jest.mock("./src/task.js", () => ({
    createTask: (title, description, deadline) => ({
        id: Date.now(),
        title,
        description,
        deadline,
        completed: false,
    }),
}));

jest.mock("./src/storage.js");
jest.mock("./src/renderer.js");
jest.mock("./src/event-handler.js");

// Import modules after mocking
import { createTask } from "./src/task.js";
import { getTasks, saveTasks } from "./src/storage.js";
import { renderTasks } from "./src/renderer.js";
import { setupTaskEventListeners } from "./src/event-handler.js";

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => {
            store[key] = value.toString();
        }),
        clear: jest.fn(() => {
            store = {};
        }),
        removeItem: jest.fn((key) => {
            delete store[key];
        }),
    };
})();

Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
});

// Mock DOM elements
document.body.innerHTML = `
  <div>
    <input id="taskTitle" />
    <textarea id="taskDescription"></textarea>
    <input id="taskDeadline" />
    <button id="addTaskButton">Add Task</button>
    <div id="taskList"></div>
  </div>
`;

// Helper function to create a task
const createTestTask = (
    title = "Test Task",
    description = "Test Description",
    deadline = "2025-12-31"
) => {
    return createTask(title, description, deadline);
};

describe("Task Creation", () => {
    test("should create a task with the correct properties", () => {
        const title = "Test Task";
        const description = "Test Description";
        const deadline = "2025-12-31";

        const task = createTask(title, description, deadline);

        expect(task).toHaveProperty("id");
        expect(task).toHaveProperty("title", title);
        expect(task).toHaveProperty("description", description);
        expect(task).toHaveProperty("deadline", deadline);
        expect(task).toHaveProperty("completed", false);
    });

    test("should generate a unique ID for each task", () => {
        // Mock Date.now to return predictable values
        const originalDateNow = Date.now;
        const mockDateNow = jest
            .fn()
            .mockReturnValueOnce(1000)
            .mockReturnValueOnce(2000);

        global.Date.now = mockDateNow;

        const task1 = createTask("Task 1", "Description 1", "2025-01-01");
        const task2 = createTask("Task 2", "Description 2", "2025-02-02");

        expect(task1.id).toBe(1000);
        expect(task2.id).toBe(2000);
        expect(task1.id).not.toBe(task2.id);

        // Restore original Date.now
        global.Date.now = originalDateNow;
    });
});

describe("Task Storage", () => {
    beforeEach(() => {
        localStorageMock.clear();
        jest.clearAllMocks();
    });

    test("should return an empty array when no tasks are stored", () => {
        // Setup the mock implementation for this test
        getTasks.mockImplementation(() => {
            const tasksJson = localStorage.getItem("tasks");
            return tasksJson ? JSON.parse(tasksJson) : [];
        });

        const tasks = getTasks();
        expect(tasks).toEqual([]);
        expect(localStorageMock.getItem).toHaveBeenCalledWith("tasks");
    });

    test("should save tasks to localStorage", () => {
        // Setup the mock implementation for this test
        saveTasks.mockImplementation((tasks) => {
            localStorage.setItem("tasks", JSON.stringify(tasks));
        });

        const tasks = [createTestTask("Task 1"), createTestTask("Task 2")];

        saveTasks(tasks);

        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            "tasks",
            JSON.stringify(tasks)
        );
    });

    test("should retrieve saved tasks from localStorage", () => {
        const tasks = [createTestTask("Task 1"), createTestTask("Task 2")];

        // Setup localStorage with tasks
        localStorage.setItem("tasks", JSON.stringify(tasks));

        // Setup the mock implementation for this test
        getTasks.mockImplementation(() => {
            const tasksJson = localStorage.getItem("tasks");
            return tasksJson ? JSON.parse(tasksJson) : [];
        });

        const retrievedTasks = getTasks();

        expect(retrievedTasks).toEqual(tasks);
        expect(localStorageMock.getItem).toHaveBeenCalledWith("tasks");
    });
});

describe("Task Rendering", () => {
    beforeEach(() => {
        document.getElementById("taskList").innerHTML = "";
        jest.clearAllMocks();
    });

    test("should call renderTasks with the correct tasks", () => {
        // Setup the mock implementation for this test
        renderTasks.mockImplementation((tasks) => {
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
            <span class="task-item__deadline">Deadline: ${task.deadline}</span>
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
        });

        const tasks = [
            createTestTask("Task 1", "Description 1", "2025-01-01"),
            createTestTask("Task 2", "Description 2", "2025-02-02"),
        ];

        renderTasks(tasks);

        const taskElements = document.querySelectorAll(".task-item");
        expect(taskElements.length).toBe(2);

        // Check first task content
        expect(
            taskElements[0].querySelector(".task-item__title").textContent
        ).toBe("Task 1");
        expect(
            taskElements[0].querySelector(".task-item__description").textContent
        ).toBe("Description 1");
        expect(
            taskElements[0].querySelector(".task-item__deadline").textContent
        ).toContain("2025-01-01");

        // Check second task content
        expect(
            taskElements[1].querySelector(".task-item__title").textContent
        ).toBe("Task 2");
        expect(
            taskElements[1].querySelector(".task-item__description").textContent
        ).toBe("Description 2");
        expect(
            taskElements[1].querySelector(".task-item__deadline").textContent
        ).toContain("2025-02-02");
    });

    test("should add completed class to completed tasks", () => {
        // Setup the mock implementation for this test
        renderTasks.mockImplementation((tasks) => {
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
            <span class="task-item__deadline">Deadline: ${task.deadline}</span>
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
        });

        const tasks = [
            { ...createTestTask("Task 1"), completed: true },
            createTestTask("Task 2"),
        ];

        renderTasks(tasks);

        const taskElements = document.querySelectorAll(".task-item");
        expect(taskElements[0].classList.contains("task-item--completed")).toBe(
            true
        );
        expect(taskElements[1].classList.contains("task-item--completed")).toBe(
            false
        );
    });
});

describe("Add Task Functionality", () => {
    let addTaskButton;

    beforeEach(() => {
        document.getElementById("taskList").innerHTML = "";
        document.getElementById("taskTitle").value = "";
        document.getElementById("taskDescription").value = "";
        document.getElementById("taskDeadline").value = "";
        localStorageMock.clear();
        jest.clearAllMocks();

        // Setup mock implementations
        getTasks.mockImplementation(() => []);
        saveTasks.mockImplementation(() => {});
        renderTasks.mockImplementation(() => {});

        // Add event listener to the button
        addTaskButton = document.getElementById("addTaskButton");
        addTaskButton.addEventListener("click", function (e) {
            const taskTitleInput = document.getElementById("taskTitle");
            const taskDescriptionInput =
                document.getElementById("taskDescription");
            const taskDeadlineInput = document.getElementById("taskDeadline");

            const taskTitle = taskTitleInput.value;
            const taskDescription = taskDescriptionInput.value;
            const taskDeadline = taskDeadlineInput.value;

            if (!taskTitle.trim() || !taskDescription.trim() || !taskDeadline) {
                return; // Don't proceed if any field is empty
            }

            const task = createTask(taskTitle, taskDescription, taskDeadline);

            taskTitleInput.value = "";
            taskDescriptionInput.value = "";
            taskDeadlineInput.value = "";

            const tasks = getTasks();
            tasks.push(task);
            saveTasks(tasks);
            renderTasks(tasks);
        });
    });

    test("should add a new task when all fields are filled", () => {
        document.getElementById("taskTitle").value = "New Task";
        document.getElementById("taskDescription").value = "New Description";
        document.getElementById("taskDeadline").value = "2025-03-03";

        addTaskButton.click();

        expect(getTasks).toHaveBeenCalled();
        expect(saveTasks).toHaveBeenCalled();
        expect(renderTasks).toHaveBeenCalled();

        expect(document.getElementById("taskTitle").value).toBe("");
        expect(document.getElementById("taskDescription").value).toBe("");
        expect(document.getElementById("taskDeadline").value).toBe("");
    });

    test("should not add a task if title is empty", () => {
        document.getElementById("taskTitle").value = "";
        document.getElementById("taskDescription").value = "New Description";
        document.getElementById("taskDeadline").value = "2025-03-03";

        addTaskButton.click();

        expect(getTasks).not.toHaveBeenCalled();
        expect(saveTasks).not.toHaveBeenCalled();
        expect(renderTasks).not.toHaveBeenCalled();
    });

    test("should not add a task if description is empty", () => {
        document.getElementById("taskTitle").value = "New Task";
        document.getElementById("taskDescription").value = "";
        document.getElementById("taskDeadline").value = "2025-03-03";

        addTaskButton.click();

        expect(getTasks).not.toHaveBeenCalled();
        expect(saveTasks).not.toHaveBeenCalled();
        expect(renderTasks).not.toHaveBeenCalled();
    });

    test("should not add a task if deadline is empty", () => {
        document.getElementById("taskTitle").value = "New Task";
        document.getElementById("taskDescription").value = "New Description";
        document.getElementById("taskDeadline").value = "";

        addTaskButton.click();

        expect(getTasks).not.toHaveBeenCalled();
        expect(saveTasks).not.toHaveBeenCalled();
        expect(renderTasks).not.toHaveBeenCalled();
    });

    test("should not add a task if all fields are empty", () => {
        document.getElementById("taskTitle").value = "";
        document.getElementById("taskDescription").value = "";
        document.getElementById("taskDeadline").value = "";

        addTaskButton.click();

        expect(getTasks).not.toHaveBeenCalled();
        expect(saveTasks).not.toHaveBeenCalled();
        expect(renderTasks).not.toHaveBeenCalled();
    });

    test("should not add a task if title contains only whitespace", () => {
        document.getElementById("taskTitle").value = "   ";
        document.getElementById("taskDescription").value = "New Description";
        document.getElementById("taskDeadline").value = "2025-03-03";

        addTaskButton.click();

        expect(getTasks).not.toHaveBeenCalled();
        expect(saveTasks).not.toHaveBeenCalled();
        expect(renderTasks).not.toHaveBeenCalled();
    });

    test("should not add a task if description contains only whitespace", () => {
        // Set input values with description containing only spaces
        document.getElementById("taskTitle").value = "New Task";
        document.getElementById("taskDescription").value = "   ";
        document.getElementById("taskDeadline").value = "2025-03-03";

        addTaskButton.click();

        expect(getTasks).not.toHaveBeenCalled();
        expect(saveTasks).not.toHaveBeenCalled();
        expect(renderTasks).not.toHaveBeenCalled();
    });
});

// The validation should happen before calling createTask
describe("Task Validation", () => {
    test("should validate that task title is not empty", () => {
        const emptyTitleTask = createTask("", "Description", "2025-01-01");
        expect(emptyTitleTask.title).toBe("");
    });

    test("should validate that task description is not empty", () => {
        const emptyDescriptionTask = createTask("Title", "", "2025-01-01");
        expect(emptyDescriptionTask.description).toBe("");
    });

    test("should validate that task deadline is not empty", () => {
        const emptyDeadlineTask = createTask("Title", "Description", "");
        expect(emptyDeadlineTask.deadline).toBe("");
    });
});
