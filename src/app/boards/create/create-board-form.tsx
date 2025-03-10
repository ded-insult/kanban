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
import { createBoard } from "@/modules/board/actions";
import React, { FormEvent, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

export const CreateBoardForm = () => {
  const [boardTitle, setBoardTitle] = useState("");
  const [columns, setColumns] = useState<string[]>(defaultSteps);
  const refStep = useRef<HTMLInputElement>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addStep = (e: FormEvent) => {
    e.preventDefault();
    const { value } = refStep.current!;

    if (!value) {
      alert("Пустой шаг");
      return;
    }

    if (columns.includes(value)) {
      alert("Такой шаг уже существует, сделайте другой");
      refStep.current!.value = "";
      return;
    }

    setColumns((prev) => [...prev, value]);

    refStep.current!.value = "";
  };

  const removeStep = (name: string) => {
    setColumns((prev) => prev.filter((value) => value !== name));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setColumns((columns) => {
        const oldIndex = columns.indexOf(active.id);
        const newIndex = columns.indexOf(over.id);

        return arrayMove(columns, oldIndex, newIndex);
      });
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardTitle.trim()) {
      alert("Необходимо записать название доски");
      return;
    }

    const result = await createBoard(boardTitle, columns);

    if (result.success) {
      alert("Успех");
      setColumns(defaultSteps);
      setBoardTitle("");
      if (refStep.current) {
        refStep.current.value = "";
      }
    } else {
      alert(`"Ошибка" ${result.data.toString()}`);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <form onSubmit={onSubmit}>
        <Input
          name="board-title"
          value={boardTitle}
          onChange={(e) => setBoardTitle(e.target.value)}
          placeholder="Название доски"
        />
        <LabelUI>Добавить свои шаги</LabelUI>
        <Input ref={refStep} placeholder="Название шага " />
        <div onClick={addStep}>Добавить шаги +</div>
        <br />
        <Popover>
          <PopoverTrigger className="cursor-pointer transition-colors duration-200 rounded-xs p-1 mt-1 hover:bg-blue-300">
            Стандартные шаги:
          </PopoverTrigger>
          <PopoverContent>
            <p className="border-4 rounded-xs p-2 bg-white">
              Выставите шаги в том порядке, какой хотите получить в итоге
            </p>
          </PopoverContent>
        </Popover>
        <SortableContext items={columns} strategy={verticalListSortingStrategy}>
          {columns.map((value) => (
            <SortableChip
              key={value}
              id={value}
              value={value}
              onDelete={() => removeStep(value)}
            />
          ))}
        </SortableContext>
        <br />
        <Button type="submit">Отправить</Button>
      </form>
    </DndContext>
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
