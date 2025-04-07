import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { TaskProps } from '../types/TaskProps';
import { useToast } from '../hooks/useToast';
import { getTasks } from '../hooks/useGetTasks';
import { saveTasks } from '../hooks/useSave';

// Shape of our context
interface TaskContextType {
  tasks: TaskProps[];
  addTask: (task: TaskProps) => void;
  deleteTask: (taskId: number) => void;
  completeTask: (taskId: number) => void;
  editTask: (taskId: number) => void;
  editingTask: TaskProps | null;
  setEditingTask: (task: TaskProps | null) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Provider component
export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [editingTask, setEditingTask] = useState<TaskProps | null>(null);
  const { showToast } = useToast();

  // Load tasks from localStorage on component mount
  useEffect(() => {
    setTasks(getTasks());
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0 || tasksInitialized) {
      saveTasks(tasks);
    }
  }, [tasks]);
  
  // Flag to track if tasks have been initialized
  const [tasksInitialized, setTasksInitialized] = useState(false);
  
  // Set the flag once tasks are loaded
  useEffect(() => {
    if (!tasksInitialized && tasks.length >= 0) {
      setTasksInitialized(true);
    }
  }, [tasks, tasksInitialized]);

  // Add a new task
  const addTask = useCallback((task: TaskProps) => {
    setTasks(prevTasks => [...prevTasks, task]);
    showToast(`Task "${task.title}" added successfully!`, 'success');
  }, [showToast]);

  // Delete a task
  const deleteTask = useCallback((taskId: number) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    if (taskToDelete) {
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      showToast(`Task "${taskToDelete.title}" deleted`, 'info');
    }
  }, [tasks, showToast]);

  // Toggle task completion status
  const completeTask = useCallback((taskId: number) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, completed: !task.completed };
        const status = updatedTask.completed ? 'completed' : 'marked as incomplete';
        showToast(`Task "${task.title}" ${status}`, 'success');
        return updatedTask;
      }
      return task;
    });
    setTasks(updatedTasks);
  }, [tasks, showToast]);

  // Set a task for editing
  const editTask = useCallback((taskId: number) => {
    const taskToEdit = tasks.find(task => task.id === taskId);
    if (taskToEdit) {
      setEditingTask(taskToEdit);
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      showToast(`Editing task "${taskToEdit.title}"`, 'info');
    }
  }, [tasks, showToast]);

  return (
    <TaskContext.Provider 
      value={{ 
        tasks, 
        addTask, 
        deleteTask, 
        completeTask, 
        editTask, 
        editingTask, 
        setEditingTask 
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook to use the task context
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
