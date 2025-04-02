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
import { Subtask, Task, User } from "@prisma/client";
import { useState } from "react";
import { updateTask } from "../(actions)";

import { getUsersByBoardId } from "../(actions)";

interface EditTaskDialogProps {
  task: Task & {
    subtasks: Subtask[];
  };
  userList: User[];
}

export const EditTaskDialog = ({ task, userList }: EditTaskDialogProps) => {
  const [taskData, setTaskData] = useState({
    title: task.title,
    description: task.description || "",
    subtasks: task.subtasks,
    assigneeId: task.assigneeId || "",
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

  const handleSubmit = async () => {
    try {
      await updateTask({
        id: task.id,
        title: taskData.title,
        description: taskData.description,
        subtasks: taskData.subtasks,
        assigneeId: taskData.assigneeId || null,
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Редактировать задачу</DialogTitle>
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
        </div>
        <DialogFooter>
          <Button variant="default" onClick={handleSubmit}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
