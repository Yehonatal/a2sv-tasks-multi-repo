import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    base: "/a2sv-tasks-multi-repo/react-projects/task-todo-react/",
    plugins: [react()],
});
