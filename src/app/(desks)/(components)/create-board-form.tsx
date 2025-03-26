"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import {
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Input } from "@/components/ui/input";
import { LabelUI } from "@/components/ui/label";
import { DndContext } from "@dnd-kit/core";
import React, { FormEvent, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BoardData, createBoard } from "../(actions)";
import { BoardColumn } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth2";
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

const defaultSteps = Object.values(localizeSteps);

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

      {/* <Popover>
        <PopoverTrigger className="cursor-pointer transition-colors duration-200 rounded-xs p-1 mt-1 hover:bg-blue-300">
          Стандартные шаги:
        </PopoverTrigger>
        <PopoverContent>
          <p className="border-4 rounded-xs p-2 bg-white">
            Выставите шаги в том порядке, какой хотите получить в итоге
          </p>
        </PopoverContent>
      </Popover> */}

      <Button type="submit">Отправить</Button>
    </form>
  );
};

const SortableChip = ({ id, value, onDelete }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Chip onDelete={onDelete} className="mr-1 ml-1" children={value} />
    </div>
  );
};
