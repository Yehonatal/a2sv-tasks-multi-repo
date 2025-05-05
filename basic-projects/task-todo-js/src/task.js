export function createTask(taskTitle, taskDescription, taskDeadline) {
    return {
        id: Date.now(),
        title: taskTitle,
        description: taskDescription,
        deadline: taskDeadline,
        completed: false,
    };
}
