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
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { createSprint } from "../../../../(actions)/sprint-actions";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldError } from "react-hook-form";
import { z } from "zod";
import { toast } from "react-toastify";

const sprintSchema = z
  .object({
    title: z.string().min(3, "Название должно содержать минимум 3 символа"),
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

    endDate: z.preprocess((arg) => {
      if (typeof arg === "string" && arg.trim() === "") return undefined;
      return typeof arg === "string" ? new Date(arg) : arg;
    }, z.date({ required_error: "Дата конца обязательна", invalid_type_error: "Введите корректную дату конца" })),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: "Дата начала не может быть позже даты окончания",
    path: ["startDate"],
  });

type SprintData = z.infer<typeof sprintSchema>;

export const SprintCreateDialog = () => {
  const { id } = useParams<{ id: string }>();

  const form = useForm({
    resolver: zodResolver(sprintSchema),
  });

  const onSubmit = async (data: SprintData) => {
    try {
      await createSprint({
        boardId: id,
        endDate: data.endDate,
        startDate: data.startDate,
        title: data.title,
      });
      toast.success("Спринт успешно создан", { autoClose: 1750 });
      form.reset();
    } catch (e) {
      toast.error("Произошла ошибка", { autoClose: 1750 });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Создать спринт
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Создать новый спринт</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Название спринта
            </label>
            <Input
              {...form.register("title")}
              id="title"
              name="title"
              error={form.formState.errors.title}
              placeholder="Введите название спринта"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="startDate" className="text-sm font-medium">
              Дата начала
            </label>
            <Input
              {...form.register("startDate")}
              id="startDate"
              name="startDate"
              error={form.formState.errors.startDate as FieldError}
              type="date"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="endDate" className="text-sm font-medium">
              Дата окончания
            </label>
            <Input
              {...form.register("endDate")}
              id="endDate"
              name="endDate"
              error={form.formState.errors.endDate as FieldError}
              type="date"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              // onClick={() => setOpen(false)}
            >
              Отмена
            </Button>
            <Button type="submit">Создать</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
