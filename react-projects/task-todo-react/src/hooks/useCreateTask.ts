import { TaskProps } from "../types/TaskProps";

export function createTask(
    taskTitle: string,
    taskDescription: string,
    taskDeadline: string
): TaskProps {
    return {
        id: Date.now(),
        title: taskTitle,
        description: taskDescription,
        deadline: taskDeadline,
        completed: false,
    };
}
