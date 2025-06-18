// import { MyColumn } from "@prisma/client";
"use client";
import { useRef, useState } from "react";
import { deleteBoardColumn, moveBoardColumnPosition } from "../(actions)";
import { useRouter } from "next/navigation";

type MyColumn = {
  id: string;
  title: string;
  status: string;
  position: number;
  boardId: string;
};

export const useColumnCard = () => {
  const [draggedItem, setDraggedItem] = useState<MyColumn | null>(null);
  const [pending, setPending] = useState(false);
  const columnsRef = useRef<HTMLDivElement[]>([]);
  const router = useRouter();

  const onDelete = async (id: string) => {
    if (
      !confirm(
        "При удалении столбца удалятся все задачи вместе с ним, вы уверены, что хотите удалить столбец ?"
      )
    ) {
      return;
    }

    try {
      await deleteBoardColumn(id);
      router.refresh();
    } catch (e) {
      alert("Ошибка");
    }
  };

  const handleDragStart =
    (column: MyColumn) => (e: React.DragEvent<HTMLDivElement>) => {
      if (pending) {
        e.preventDefault();
        return;
      }
      e.dataTransfer.setData("text/plain", column.id);
      setDraggedItem(column);
      (e.target as HTMLElement).style.opacity = "0.4";
    };

  const handleDragOver =
    (column: MyColumn) => (e: React.DragEvent<HTMLDivElement>) => {
      if (pending) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      if (!draggedItem || draggedItem.id === column.id) return;
    };

  const handleDrop =
    (targetColumn: MyColumn) => async (e: React.DragEvent<HTMLDivElement>) => {
      if (pending) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      (e.target as HTMLElement).style.opacity = "1";

      if (!draggedItem || draggedItem.id === targetColumn.id) {
        setDraggedItem(null);
        return;
      }

      setPending(true);

      try {
        await Promise.all([
          moveBoardColumnPosition({
            columnId: draggedItem.id,
            newPosition: targetColumn.position,
          }),
          moveBoardColumnPosition({
            columnId: targetColumn.id,
            newPosition: draggedItem.position,
          }),
        ]);
        router.refresh();
      } catch (error) {
        console.error("Error updating positions:", error);
        alert("Не удалось обновить позиции");
      } finally {
        setPending(false);
        setDraggedItem(null);
      }
    };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    (e.target as HTMLElement).style.opacity = "1";
    setDraggedItem(null);
  };
  return {
    onDelete,
    columnsRef,
    handleDragEnd,
    handleDragStart,
    handleDrop,
    handleDragOver,
    pending,
  };
};
