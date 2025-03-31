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
import { createTask, TaskData } from "../(actions)";
import { Role, RoleType } from "@prisma/client";

type User = {
  id: string;
  name: string;
  role: Role;
};

interface Props {
  columnId: string;
  userList: User[];
}

const initialFormData: TaskData = {
  columnId: "",
  assigneeId: "",
  title: "",
  description: "",
  sectionId: null,
  startDate: null,
  endDate: null,
  sprintId: null,
  subtasks: [],
  approved: false,
};

const formatDate = (date: Date | null): string => {
  return date ? date.toISOString().split("T")[0] : "";
};

export const CreateTaskDialog = ({ columnId, userList }: Props) => {
  const [formData, setFormData] = useState<TaskData>({
    ...initialFormData,
    columnId,
  });
  const [newSubtask, setNewSubtask] = useState("");

  const handleCreateCard = async () => {
    console.log("Creating card:", formData);
    // Add logic to save the task using Prisma or another method
  };

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

  const onSubmit = async () => {
    try {
      await createTask(formData);
      alert("Успешно");
      setFormData(initialFormData);
    } catch (e) {
      alert("Ошибка");
    }
  };

  return (
    <Dialog>
      {/* {JSON.stringify(userList)} */}
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
            value={formData.description}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          {/* <input
              type="text"
              name="sectionId"
              placeholder="ID секции (если есть)"
              value={formData.sectionId || ""}
              onChange={handleChange}
              className="border p-2 rounded"
            /> */}
          <input
            type="date"
            name="startDate"
            placeholder="Дата начала"
            value={formatDate(formData.startDate!)}
            onChange={handleChange}
            className="border p-2 rounded"
          />
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

        <select
          name="assigneeId"
          value={formData.assigneeId || ""}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Выберите исполнителя</option>
          {userList.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.role.name})
            </option>
          ))}
        </select>

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
