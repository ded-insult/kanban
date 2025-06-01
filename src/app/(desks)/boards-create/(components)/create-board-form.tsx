"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { FormEvent, useState } from "react";
import { BoardData, createBoard } from "../(actions)";
import { BoardColumn } from "@prisma/client";
import { getCurrentUser } from "@/shared/lib/auth";
import { flushSync } from "react-dom";

enum Step {
  BACKLOG = "BACKLOG",
  IN_PGORESS = "IN_PROGRESS",
  DONE = "DONE",
}

const localizeSteps: Record<Step, string> = {
  [Step.BACKLOG]: "Бэклог",
  [Step.IN_PGORESS]: "В процессе",
  [Step.DONE]: "Готово",
};

const initialFormData: BoardData = {
  columns: [],
  ownerId: "",
  title: "",
};

export const CreateBoardForm = () => {
  const [formData, setFormData] = useState<BoardData>(initialFormData);

  const onChangeTitle = (title: BoardData["title"]) => {
    setFormData((p) => ({ ...p, title }));
  };

  const onDeleteColumn = (id: BoardColumn["id"]) => {
    const newColumns: BoardData["columns"] = formData.columns!.filter(
      (column) => column.id !== id
    );

    setFormData((p) => ({ ...p, columns: newColumns }));
  };

  const onAddColumn = (column: BoardColumn) => {
    const newColumns: BoardData["columns"] = [...formData.columns!, column];

    setFormData((p) => ({ ...p, columns: newColumns }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const user = await getCurrentUser();
    const { id } = user!;

    flushSync(() => {
      setFormData((p) => ({
        ...p,
        ownerId: id,
      }));
    });

    try {
      if (!id || !formData.title) {
        console.log(formData);

        alert("Заполните все поля");
        return;
      }

      await createBoard({
        // columns: formData.columns,
        ownerId: id,
        title: formData.title,
      });
      alert("Успех");
    } catch (e) {
      alert("Ошибка");
      return;
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Input
        name="board-title"
        value={formData.title}
        onChange={(e) => onChangeTitle(e.target.value)}
        placeholder="Название доски"
      />

      <Button type="submit">Отправить</Button>
    </form>
  );
};
