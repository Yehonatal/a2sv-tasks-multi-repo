export interface Task {
    id: number;
    title: string;
    description: string;
    deadline: string;
    completed: boolean;
}

export function createTask(taskTitle: string, taskDescription: string, taskDeadline: string): Task  {
    return {
        id: Date.now(),
        title: taskTitle,
        description: taskDescription,
        deadline: taskDeadline,
        completed: false,
    };
  }