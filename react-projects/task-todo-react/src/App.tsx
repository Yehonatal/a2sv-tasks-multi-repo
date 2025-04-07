import Header from './components/Header'
import CreateForm from './components/CreateForm'
import TaskList from './components/TaskList'
import Toast from './components/Toast'
import { TaskProvider } from './context/TaskContext'
import { ToastProvider } from './context/ToastContext'

function App() {
  return (
    <ToastProvider>
      <TaskProvider>
        <Header />
        <main className="main">
          <CreateForm />
          <div className="task-view">
            <TaskList />
          </div>
        </main>
        <Toast />
      </TaskProvider>
    </ToastProvider>
  )
}

export default App
