// "use client";
// import { useEffect, useState } from "react";
// import { getTasksWithSubtasks, Zapula } from "../(actions)";
// import { Task } from "@prisma/client";

import { getTasksWithSubtasks } from "../(actions)";

type Subtask = {
  id: string;
  title: string;
  completed: boolean;
};

// type Task = {
//   id: string;
//   title: string;
//   description?: string;
//   subtasks: Subtask[];
// };

interface Props {
  columnId: string;
  // tasks: any;
}

export const TaskList = async ({ columnId }: Props) => {
  // const [tasks, setTasks] = useState([]);
  const tasks = await getTasksWithSubtasks(columnId);
  // useEffect(() => {
  //   const fetchTasks = async () => {
  //     const tasksData = await getTasksWithSubtasks(columnId);
  //     setTasks(tasksData);
  //   };

  //   fetchTasks();
  // }, [columnId]);

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div key={task.id} className="task-card border p-4 rounded mb-4">
          <h3 className="task-title font-bold">{task.title}</h3>
          {task.description && <p className="task-desc">{task.description}</p>}
          <ul className="subtask-list mt-2">
            {task.subtasks.map((subtask) => (
              <li key={subtask.id} className="subtask-item">
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  readOnly
                  className="mr-2"
                />
                {subtask.title}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
