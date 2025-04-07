import { TaskProps } from "../types/TaskProps"
import { useTaskContext } from "../context/TaskContext"

const Task = ({ title, description, deadline, id, completed }: TaskProps) => {
  const { deleteTask, completeTask, editTask } = useTaskContext()
  
  return (
    <div className={completed ? "task-item task-item--completed" : "task-item"}>
      <div className="task-item__header">
        <h3 className="task-item__title">{title}</h3>
        <span className="task-item__deadline">{deadline}</span>
      </div>
      <p className="task-item__description">{description}</p>
      <div className="task-item__controls">
        <button 
          className="task-item__button task-item__button--edit js-edit-task" 
          onClick={() => editTask(id!)}
          aria-label="Edit task"
        >
          Edit
        </button>
        <button 
          className="task-item__button task-item__button--complete js-complete-task" 
          onClick={() => completeTask(id!)}
          aria-label="Toggle task completion"
        >
          {completed ? "Uncomplete" : "Complete"}
        </button>
        <button 
          className="task-item__button task-item__button--delete js-delete-task" 
          onClick={() => deleteTask(id!)}
          aria-label="Delete task"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default Task