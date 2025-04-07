import { useTaskContext } from "../context/TaskContext"

const Header = () => {
  const { tasks } = useTaskContext()
  const completedCount = tasks.filter(task => task.completed).length
  
  return (
    <header className="header">
      <div className="task_title">
        <h1>TODO LIST + REACT</h1>
      </div>

      <div className="task_number">
        <h4>Tasks: {completedCount} / {tasks.length}</h4>
      </div>
    </header>
  )
}

export default Header