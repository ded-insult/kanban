"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTask } from "../../(actions)";
import { TaskPriority } from "@prisma/client";
import { BoardAddUsersDialog } from "./board-add-users-dialog";
import { BoardParticipants } from "../../page";
import { PriorityOptionsList } from "@/components/ui/task-label";
import { useBoardContext } from "./board-context";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { toast } from "react-toastify";
import { useSubtasksCreate } from "./model/use-subtasks-create";

const taskSchema = z
  .object({
    title: z.string().min(1, "Название обязательно"),
    description: z.string().optional(),
    priority: z.nativeEnum(TaskPriority),
    startDate: z
      .string()
      .min(1, "Дата начала обязательна")
      .transform((value) => new Date(value)),
    endDate: z
      .string()
      .min(1, "Дата конца обязательна")
      .transform((value) => new Date(value)),
    assigneeId: z.string().min(1, "Исполнитель обязателен"),
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: "Дата начала не может быть позже даты окончания",
    path: ["startDate"],
  });

export type TaskFormData = z.infer<typeof taskSchema>;

interface Props {
  columnId: string;
  boardId: string;
  sprintId: string;
  userList: BoardParticipants;
  canAddParticipant: boolean;
}
export const BoardCreateTaskExtendedDialog = ({
  columnId,
  userList = [],
  boardId,
  sprintId,
  canAddParticipant,
}: Props) => {
  const { user } = useBoardContext();
  const subtasks = useSubtasksCreate();
  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: "LOW",
    },
  });

  const onSubmit = async (data: z.infer<typeof taskSchema>) => {
    console.log({
      ...data,
      creatorId: user!.id,
      columnId,
      sprintId,
      subtasks: subtasks.data,
      approved: false,
    });
    try {
      await createTask({
        ...data,
        creatorId: user!.id,
        columnId,
        sprintId,
        subtasks: subtasks.data,
        approved: false,
      });
      toast.success("Успешно", { autoClose: 1750 });
      form.reset();
      subtasks.empty();
    } catch (e) {
      toast.error("Ошибка, проверьте поля", { autoClose: 1750 });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Создать карточку</Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-scroll max-h-[90vh] p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-4">
            Создать новую карточку
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4"
        >
          {/* Название */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="title">Название</Label>
            <Input
              {...form.register("title")}
              type="text"
              placeholder="Введите название"
              error={form.formState.errors.title}
            />
          </div>

          {/* Описание */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="description">Описание</Label>
            <textarea
              {...form.register("description")}
              placeholder="Введите описание"
              className="border p-2 rounded min-h-[80px]"
            />
          </div>

          {/* Приоритет */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="priority">Приоритет</Label>
            <select
              {...form.register("priority")}
              className="border p-2 rounded"
            >
              <PriorityOptionsList />
            </select>
          </div>

          {/* Даты */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="startDate">Дата начала</Label>
              <Input
                {...form.register("startDate")}
                type="date"
                error={form.formState.errors.startDate}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="endDate">Дата конца</Label>
              <Input
                {...form.register("endDate")}
                type="date"
                error={form.formState.errors.endDate}
              />
            </div>
          </div>

          {/* Подзадачи */}
          <div className="bg-gray-100 rounded-lg p-4 flex flex-col gap-2">
            <Label>Подзадачи</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Новая подзадача"
                value={subtasks.title}
                onChange={subtasks.handleSubtaskChange}
              />
              <Button type="button" onClick={subtasks.handleAddSubtask}>
                Добавить
              </Button>
            </div>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {subtasks.data.map((subtask, i) => (
                <li key={i}>
                  {subtask}{" "}
                  <span
                    className="cursor-pointer text-red-500"
                    onClick={subtasks.handleDeleteSubtask(i)}
                  >
                    Удалить{" "}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Исполнитель */}
          <div className="flex flex-col gap-1">
            <Label>Исполнитель</Label>
            <select
              {...form.register("assigneeId")}
              className={`border p-2 rounded ${
                form.formState.errors.assigneeId && "border-red-500"
              }`}
            >
              <option value="">Выберите исполнителя</option>
              {userList.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role.name})
                </option>
              ))}
            </select>
            {form.formState.errors.assigneeId && (
              <span className="text-red-500 text-sm">
                {form.formState.errors.assigneeId.message}
              </span>
            )}
          </div>

          {/* Добавление пользователей */}
          <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 border rounded-md">
            {userList.length === 0 && (
              <p className="text-sm text-gray-600">
                Нет доступных исполнителей
              </p>
            )}
            {canAddParticipant && <BoardAddUsersDialog boardId={boardId} />}
          </div>

          {/* Кнопки */}
          <div className="flex justify-end gap-2 mt-2">
            <Button type="submit" variant="default">
              Создать
            </Button>
            <DialogTrigger className="text-sm text-gray-500 hover:underline">
              Отмена
            </DialogTrigger>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
