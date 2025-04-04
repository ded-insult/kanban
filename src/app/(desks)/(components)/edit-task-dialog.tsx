"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RoleType, Subtask, Task, TaskPriority, User } from "@prisma/client";
import { useState } from "react";
import { deleteTask, updateTask } from "../(actions)";

import { getUsersByBoardId } from "../(actions)";
import { can } from "@/lib/permissions";
import { priorityLabels, priorityColors } from "@/lib/priority";

interface EditTaskDialogProps {
  task: Task & {
    subtasks: Subtask[];
  };
  userRole: RoleType;
  userList: User[];
}

export const EditTaskDialog = ({
  task,
  userList,
  userRole,
}: EditTaskDialogProps) => {
  const [taskData, setTaskData] = useState({
    title: task.title,
    description: task.description || "",
    subtasks: task.subtasks,
    assigneeId: task.assigneeId || "",
    priority: task.priority || "LOW", // Add priority to state
  });

  const handleTaskChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubtaskChange = (
    subtaskId: string,
    field: "title" | "completed",
    value: string | boolean
  ) => {
    setTaskData((prev) => ({
      ...prev,
      subtasks: prev.subtasks.map((subtask) =>
        subtask.id === subtaskId ? { ...subtask, [field]: value } : subtask
      ),
    }));
  };

  const handleDelete = async () => {
    if (confirm("Вы уверены, что хотите удалить задачу?")) {
      try {
        await deleteTask(task.id);
        alert("Задача удалена");
        window.location.reload(); // Refresh to show updated list
      } catch (error) {
        alert("Ошибка при удалении задачи");
      }
    }
  };

  const handleSubmit = async () => {
    try {
      await updateTask({
        id: task.id,
        title: taskData.title,
        description: taskData.description,
        subtasks: taskData.subtasks,
        assigneeId: taskData.assigneeId || null,
        priority: taskData.priority,
      });
      alert("Задача обновлена");
    } catch (error) {
      alert("Ошибка при обновлении задачи");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Редактировать
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Редактировать задачу</span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block mb-2">Название</label>
            <input
              type="text"
              name="title"
              value={taskData.title}
              onChange={handleTaskChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Описание</label>
            <textarea
              name="description"
              value={taskData.description}
              onChange={handleTaskChange}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
          <div>
            <label className="block mb-2">Подзадачи</label>
            {taskData.subtasks.map((subtask) => (
              <div key={subtask.id} className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  onChange={(e) =>
                    handleSubtaskChange(
                      subtask.id,
                      "completed",
                      e.target.checked
                    )
                  }
                  className="mr-2"
                />
                <input
                  type="text"
                  value={subtask.title}
                  onChange={(e) =>
                    handleSubtaskChange(subtask.id, "title", e.target.value)
                  }
                  className="flex-1 p-2 border rounded"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="block mb-2">Исполнитель</label>
            <select
              name="assigneeId"
              value={taskData.assigneeId}
              onChange={handleTaskChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Не назначен</option>
              {userList?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.name})
                </option>
              ))}
            </select>
          </div>

          {/* Add priority selection */}
          <div>
            <label className="block mb-2">Приоритет</label>
            <select
              name="priority"
              value={taskData.priority}
              onChange={handleTaskChange}
              className="w-full p-2 border rounded"
            >
              {Object.entries(priorityLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <DialogFooter>
          {can(userRole, "task", "delete") && (
            <Button variant="destructive" onClick={handleDelete}>
              Удалить
            </Button>
          )}
          <Button variant="default" onClick={handleSubmit}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
