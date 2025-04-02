import { User } from "@prisma/client";
import { getTasksWithSubtasks2 } from "../(actions)";
import { EditTaskDialog } from "./edit-task-dialog";

interface Props {
  columnId: string;
  // TODO: исправить хуйню
  userList: any[];
}

export const TaskList = async ({ columnId, userList }: Props) => {
  const tasks = await getTasksWithSubtasks2(columnId);

  return (
    <div className="task-list space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="task-card bg-white border border-gray-200 shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="task-title text-lg font-semibold text-gray-900">
              {task.title}
            </h3>
            <EditTaskDialog task={task} userList={userList} />
          </div>

          {task.assignee && (
            <div className="flex items-center gap-2 mb-3 bg-gray-50 rounded-md p-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                {task.assignee.name[0].toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">
                  {task.assignee.name}
                </span>
                <span className="text-xs text-gray-500">
                  {task.assignee.role.name}
                </span>
              </div>
            </div>
          )}

          {task.description && (
            <p className="task-desc text-gray-600 mb-4 text-sm">
              {task.description}
            </p>
          )}

          {task.subtasks.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Подзадачи ({task.subtasks.length})
              </h4>
              <ul className="subtask-list space-y-2">
                {task.subtasks.map((subtask) => (
                  <li
                    key={subtask.id}
                    className="subtask-item flex items-center gap-3 p-2 rounded-md hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        readOnly
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span
                        className={`ml-3 text-sm ${
                          subtask.completed
                            ? "text-gray-400 line-through"
                            : "text-gray-700"
                        }`}
                      >
                        {subtask.title}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              {/* <span>Создано: {new Date(task.createdAt).toLocaleDateString()}</span> */}
              {task.endDate && (
                <span className="flex items-center">
                  <span className="mr-1">Срок:</span>
                  <span
                    className={`${
                      new Date(task.endDate) < new Date()
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {new Date(task.endDate).toLocaleDateString()}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
