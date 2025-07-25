"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createBoardColumn } from "../(actions)";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo } from "react";
import { useRouter } from "next/navigation";

const columnHeaderSchema = z.object({
  title: z.string().min(1, "Название обязательно"),
});

type FormData = z.infer<typeof columnHeaderSchema>;

export const ColumnCreateForm = memo(
  ({
    boardId,
    columnPosition,
  }: {
    boardId: string;
    columnPosition: number;
  }) => {
    const router = useRouter();
    const form = useForm({
      resolver: zodResolver(columnHeaderSchema),
    });

    const onSubmit = async (data: FormData) => {
      try {
        await createBoardColumn({
          status: data.title,
          title: data.title,
          position: columnPosition,
          boardId,
        });
        toast.success("Столбец добавлен", { autoClose: 1750 });
        form.reset();
        router.refresh();
      } catch (e) {
        console.error("Ошибка", e);
        toast.error("Ошибка", { autoClose: 1750 });
      }
    };
    return (
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Input
          {...form.register("title")}
          error={form.formState.errors.title}
          placeholder="Введите название этапа"
        />
        <Button>Добавить столбец</Button>
      </form>
    );
  }
);
