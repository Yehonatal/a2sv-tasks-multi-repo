import { useState, useEffect } from "react";
import { useTaskContext } from "../context/TaskContext";
import { createTask } from "../hooks/useCreateTask";
import { useToast } from "../hooks/useToast";

const CreateForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    
    const { addTask, editingTask, setEditingTask } = useTaskContext();
    const { showToast } = useToast();

    useEffect(() => {
        if (editingTask) {
            setTitle(editingTask.title);
            setDescription(editingTask.description);
            setDeadline(editingTask.deadline);
            setIsEditing(true);
        }
    }, [editingTask]);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setDeadline('');
        setIsEditing(false);
        setEditingTask(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate form inputs
        if (!title.trim()) {
            showToast('Please enter a task title', 'error');
            return;
        }

        if (!deadline) {
            showToast('Please enter a deadline', 'error');
            return;
        }

        if (!description.trim()) {
            showToast('Please enter a task description', 'error');
            return;
        }

        const task = createTask(title, description, deadline);
        addTask(task);
        resetForm();
    };

    const handleCancel = () => {
        resetForm();
        showToast('Task editing cancelled', 'info');
    };

    return (
        <form className="task-create" onSubmit={handleSubmit}>
            <div className="task-create__input-container">
                <div className="task-create__input-header">
                    <input 
                        className="task-create__input" 
                        id="taskTitle" 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Add a new task title..."
                    />
                    <input 
                        className="task-create__input"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        type="date" 
                        id="taskDeadline"
                    />
                </div>
                <textarea 
                    className="task-create__textarea" 
                    id="taskDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Task Description"
                ></textarea>
            </div>
            <div className="task-create__controls">
                {isEditing && (
                    <button 
                        type="button" 
                        onClick={handleCancel} 
                        className="task-create__button task-create__button--cancel"
                    >
                        Cancel
                    </button>
                )}
                <button 
                    type="submit" 
                    id="addTaskButton" 
                    className="task-create__button"
                >
                    {isEditing ? 'Update Task' : 'Create Task'}
                </button>
            </div>
        </form>
    );
};
    
export default CreateForm