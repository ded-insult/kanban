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
import { useEffect, useState } from "react";
import { createTask } from "../(actions)";
import { Role, RoleType, Task, TaskPriority, User } from "@prisma/client";
import { AddBoardUsersDialog } from "./add-board-users-dialog";
import { can } from "@/lib/permissions";
import { priorityLabels } from "@/lib/priority";
import { getCurrentUser } from "@/lib/auth2";
import { createSprintTask } from "../(actions)/sprint-actions";

interface Props {
  userRole: string;
  sprintId: string;
  userId: string;
  onTaskCreated?: () => void;
}

// const initialFormData: TaskData = {
export type NewTask = Omit<Task, "id" | ""> & { subtasks: string[] };

type TaskData = {
  title: string;
  description: string;
  sprintId: string | null;
  creatorId: string;
  assigneeId: string;
  subtasks: string[];
  approved: boolean;
  startDate: Task["startDate"];
  endDate: Task["endDate"];
  priority: TaskPriority;
};

const initialFormData: TaskData = {
  creatorId: "",
  title: "",
  endDate: new Date(),
  startDate: new Date(),
  description: "",
  sprintId: null,
  assigneeId: "",
  subtasks: [],
  approved: false,
  priority: "LOW",
};

const formatDate = (date: Date | null): string => {
  return date ? date.toISOString().split("T")[0] : "";
};

export const SprintTaskCreate = ({
  onTaskCreated,
  sprintId,
  userId,
}: Props) => {
  const [formData, setFormData] = useState<TaskData>({
    ...initialFormData,
    creatorId: userId,
    sprintId,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,

      [name]:
        name === "startDate" || name === "endDate" ? new Date(value) : value,
    }));
  };

  const onSubmit = async () => {
    if (!formData.title) {
      alert("Введите название карточки");
      return;
    }
    try {
      await createSprintTask({
        sprintId: formData.sprintId!,
        creatorId: formData.creatorId,
        title: formData.title,
        description: formData.description || "",
        priority: formData.priority,
        startDate: new Date(formData.startDate!),
        endDate: new Date(formData.endDate!),
      });
      alert("Успешно");
      setFormData(() => {
        const newData = {
          ...initialFormData,
          creatorId: userId,
          sprintId,
          priority: "LOW",
        } as TaskData;

        return {
          ...newData,
        };
      });
      onTaskCreated?.();
    } catch (e) {
      alert("Ошибка");
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        {/* {userRole} */}
        <span>Создать карточку</span>
      </DialogTrigger>
      <DialogContent className="overflow-y-scroll max-h-[500px]">
        <DialogHeader>
          <DialogTitle>Создать новую карточку</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            name="title"
            placeholder="Название карточки"
            value={formData.title}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Описание карточки"
            value={formData.description!}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <div>
            <label className="block mb-2 text-sm font-medium">Приоритет</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              {Object.entries(priorityLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <label className="block mb-2 text-sm font-medium">Дата начала</label>
          <input
            type="date"
            name="startDate"
            placeholder="Дата начала"
            value={formatDate(formData.startDate!)}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <label className="block mb-2 text-sm font-medium">Дата конца</label>
          <input
            type="date"
            name="endDate"
            placeholder="Дата окончания"
            value={formatDate(formData.endDate!)}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          {/* <input
              type="text"
              name="sprintId"
              placeholder="ID спринта (если есть)"
              value={formData.sprintId || ""}
              onChange={handleChange}
              className="border p-2 rounded"
            /> */}
        </div>

        <DialogFooter>
          <Button variant="default" type="submit" onClick={onSubmit}>
            Создать
          </Button>
          <DialogTrigger>Отмена</DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
