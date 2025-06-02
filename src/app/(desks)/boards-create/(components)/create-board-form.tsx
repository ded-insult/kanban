"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { createBoard } from "../(actions)";
import { getCurrentUser } from "@/shared/lib/auth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { toast } from "react-toastify";

const BoardSchema = z.object({
  title: z.string().min(3, "Название должно содержать хотя бы 3 символа"),
  ownerId: z.string().optional(),
});

type BoardData = z.infer<typeof BoardSchema>;

export const CreateBoardForm = () => {
  const form = useForm({
    resolver: zodResolver(BoardSchema),
  });

  const onSubmit = async (data: BoardData) => {
    try {
      const { id } = (await getCurrentUser()) as User;
      await createBoard({ ownerId: id, title: data.title });
      toast.success("Доска успешно создана !", { autoClose: 1750 });
    } catch (e) {
      toast.error("Произошла ошибка, повторите", { autoClose: 1750 });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input
        {...form.register("title")}
        name="title"
        placeholder="Название проекта"
        error={form.formState.errors.title}
      />

      <Button>Отправить</Button>
    </form>
  );
};
