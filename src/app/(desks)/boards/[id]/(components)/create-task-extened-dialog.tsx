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
import { useState } from "react";
import { createTask } from "../(actions)";
import { Task } from "@prisma/client";
import { AddBoardUsersDialog } from "./add-board-users-dialog";
import { BoardParticipants } from "../page";
import { PriorityOptionsList } from "@/components/ui/task-label";

interface Props {
  columnId: string;
  boardId: string;
  sprintId: string;
  userList: BoardParticipants;
  canAddParticipant: boolean;
}

// const initialFormData: TaskData = {
export type NewTask = Omit<Task, "id"> & {
  subtasks: string[];
};
const initialFormData: NewTask = {
  columnId: "",
  creatorId: "",
  title: "",
  description: "",
  sectionId: null,
  startDate: null,
  endDate: null,
  sprintId: null,
  assigneeId: "",
  subtasks: [],
  approved: false,
  priority: "LOW",
};

const formatDate = (date: Date | null): string => {
  return date ? date.toISOString().split("T")[0] : "";
};

export const CreateTaskExtendedDialog = ({
  columnId,
  userList = [],
  boardId,
  sprintId,
  canAddParticipant,
}: Props) => {
  const [formData, setFormData] = useState<NewTask>({
    ...initialFormData,
    columnId,
    sprintId,
  });
  const [newSubtask, setNewSubtask] = useState("");

  const addSubtask = () => {
    if (newSubtask) {
      setFormData((prevData) => ({
        ...prevData,
        subtasks: [...(prevData.subtasks ?? []), newSubtask],
      }));
      setNewSubtask("");
    }
  };

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

  // TODO: Пофиксить баг с созданием карточки, нету formData.assigneeId || !formData.creatorId
  const onSubmit = async () => {
    console.log(formData);
    if (!formData.title || !formData.assigneeId || !formData.creatorId) {
      alert("Введите название карточки");
      return;
    }
    try {
      await createTask(formData);
      alert("Успешно");
      setFormData(() => {
        return {
          ...initialFormData,
          columnId,
          priority: "LOW",
        };
      });
    } catch (e) {
      alert("Ошибка");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Создать карточку</Button>
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

          {/* Add priority selection */}
          <div>
            <label className="block mb-2 text-sm font-medium">Приоритет</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              {/* {Object.entries(priorityLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))} */}

              <PriorityOptionsList />
            </select>
          </div>

          {/* <input
              type="text"
              name="sectionId"
              placeholder="ID секции (если есть)"
              value={formData.sectionId || ""}
              onChange={handleChange}
              className="border p-2 rounded"
            /> */}
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
          <div>
            <label className="block mb-2 text-sm font-medium">Подзадачи</label>

            <input
              type="text"
              placeholder="Добавить подзадачу"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              className="border p-2 rounded"
            />
            <Button variant="default" onClick={addSubtask}>
              Добавить подзадачу
            </Button>
            <ul>
              {formData.subtasks?.map((subtask, index) => (
                <li key={index}>{subtask}</li>
              ))}
            </ul>
          </div>
        </div>

        {userList.length > 0 && (
          <>
            <label className="block mb-2 text-sm font-medium">
              Исполнитель
            </label>

            <select
              name="assigneeId"
              value={formData.assigneeId || ""}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="">Выберите исполнителя</option>
              {userList.map((user) => (
                <option key={user!.id} value={user!.id}>
                  {user!.name} ({user!.role.name})
                </option>
              ))}
            </select>
          </>
        )}
        <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-md">
          {userList.length === 0 && (
            <p className="text-sm text-gray-600">Нет доступных исполнителей</p>
          )}

          {canAddParticipant && <AddBoardUsersDialog boardId={boardId} />}
        </div>

        <DialogFooter>
          <div>
            <Button variant="default" type="submit" onClick={onSubmit}>
              Создать
            </Button>
            <DialogTrigger>
              Отмена
              {/* <Button variant="default">Отмена</Button> */}
            </DialogTrigger>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
