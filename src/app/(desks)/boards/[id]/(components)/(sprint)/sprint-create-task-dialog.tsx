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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSprintTask } from "../../(actions)";
import { PriorityOptionsList } from "@/components/ui/task-label";
import { TaskPriority } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface Props {
  sprintId: string;
}

const taskSchema = z
  .object({
    title: z.string().min(1, "Название обязательно"),
    description: z.string().optional(),
    priority: z.nativeEnum(TaskPriority),
    startDate: z.preprocess(
      (arg) => {
        if (typeof arg === "string" && arg.trim() === "") return undefined;
        return typeof arg === "string" ? new Date(arg) : arg;
      },
      z.date({
        required_error: "Дата начала обязательна",
        invalid_type_error: "Введите корректную дату начала",
      })
    ),
    endDate: z.preprocess(
      (arg) => {
        if (typeof arg === "string" && arg.trim() === "") return undefined;
        return typeof arg === "string" ? new Date(arg) : arg;
      },
      z.date({
        required_error: "Дата конца обязательна",
        invalid_type_error: "Введите корректную дату конца",
      })
    ),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: "Дата начала не может быть позже даты окончания",
    path: ["startDate"],
  });

type TaskFormData = z.infer<typeof taskSchema>;

export const SprintCreateTaskDialog = ({ sprintId }: Props) => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: "LOW",
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      await createSprintTask({
        sprintId,
        title: data.title,
        description: data.description ?? "",
        priority: data.priority,
        startDate: data.startDate,
        endDate: data.endDate,
      });
      toast.success("карточка создана", { autoClose: 1750 });
      form.reset();
      router.refresh();
    } catch (e) {
      toast.error("Ошибка при создании карточки", { autoClose: 1750 });
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer">
        <span>Создать карточку</span>
      </DialogTrigger>
      <DialogContent className="overflow-y-scroll max-h-[500px]">
        <DialogHeader>
          <DialogTitle>Создать новую карточку</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div>
            <Input
              type="text"
              placeholder="Название карточки"
              {...form.register("title")}
              className="border p-2 rounded w-full"
              error={form.formState.errors.title}
            />
          </div>

          <textarea
            placeholder="Описание карточки"
            {...form.register("description")}
            className="border p-2 rounded w-full"
          />

          <div>
            <label className="block mb-2 text-sm font-medium">Приоритет</label>
            <select
              {...form.register("priority")}
              className="border p-2 rounded w-full"
            >
              <PriorityOptionsList />
            </select>
          </div>

          <div>
            <Label className="block mb-2 text-sm font-medium">
              Дата начала
            </Label>
            <Input
              {...form.register("startDate")}
              type="date"
              className="border p-2 rounded w-full"
              error={form.formState.errors.startDate as any}
            />
          </div>

          <div>
            <Label className="block mb-2 text-sm font-medium">
              Дата окончания
            </Label>
            <Input
              {...form.register("endDate")}
              error={form.formState.errors.endDate}
              type="date"
              className="border p-2 rounded w-full"
            />
          </div>

          <DialogFooter>
            <Button type="submit">Создать</Button>
            <DialogTrigger>Отмена</DialogTrigger>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
