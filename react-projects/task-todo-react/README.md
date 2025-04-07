# Task 4 - Todo List App + React

A simple Todo List application built with React and Typescript. This project allows users to add tasks with a title, description, and deadline. Tasks can be edited, marked as completed, or deleted, and they are stored in the browser's local storage for persistence. Additional feature toast notifications are displayed based on the action performed by the user.

## Features

- **Add Tasks:** Create new tasks with a title, description, and deadline.
  ![Add Tasks](./src/assets/create_task.png) - _Users can input task details and add them to the list._
  ![View Tasks](./src/assets/multiple_tasks.png) - _Users can see the tasks in a grid_
- **Edit Tasks:** Update task details.
  ![Edit Tasks](./src/assets/edit_task.png) - _Tasks can be modified after they have been created._
  ![Edited Tasks](./src/assets/after_edit_of_task.png) - _After the task is modified_
- **Complete Tasks:** Mark tasks as completed.
  ![Complete Tasks](./src/assets/complete_task.png) - _Visually distinguish completed tasks from pending ones._
- **Delete Tasks:** Remove tasks from the list.
  ![Delete Tasks](./src/assets/delete_task.png) - _Tasks can be permanently removed from the list as you can see on the previous image the modified task is removed_

- **Local Storage:** Tasks are saved in the browser for persistent data.
- **Notifications:** Display informative messages to the user using a toast notification system.
- **Test Suite:** Includes a comprehensive test suite to ensure code quality and prevent regressions.
