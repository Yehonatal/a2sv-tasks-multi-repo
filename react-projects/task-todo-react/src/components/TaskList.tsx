import Task from "./Task";
import { useTaskContext } from "../context/TaskContext";

const TaskList = () => {
    const { tasks } = useTaskContext();

    return (
        <div id="taskList" className="task-list">
            {tasks.length === 0 ? (
                <div className="task-list__empty">
                    No tasks yet. Create one to get started!
                </div>
            ) : (
                tasks.map((task) => (
                    <Task
                        key={task.id}
                        title={task.title}
                        description={task.description}
                        deadline={task.deadline}
                        id={task.id}
                        completed={task.completed}
                    />
                ))
            )}
        </div>
    );
};

export default TaskList;
