"use client";
import { useState, useRef } from "react";
import {
  BoardColumnData,
  createBoardColumn,
  deleteBoardColumn,
  moveBoardColumnPosition,
} from "../(actions)";
import { BoardColumn } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { ColumnTitleUpdateDialog } from "./column-title-update-dialog";

type ColumnData = Omit<BoardColumnData, "boardId" | "position">;
const initialFormData: ColumnData = {
  status: "",
  title: "",
};

export const BoardColumnsPositionUpdate = ({
  initialColumns,
}: {
  initialColumns: BoardColumn[];
}) => {
  return (
    <>
      {/* Блок со списком столбцов */}
      <div className="p-4 border rounded-xl bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Список столбцов</h3>
        <div className="space-y-2">
          {/* {initialColumns.map((column) => (
            <div
              key={column.id}
              draggable={!pending}
              onDragStart={(e) => handleDragStart(e, column)}
              onDragOver={(e) => handleDragOver(e, column)}
              onDrop={(e) => handleDrop(e, column)}
              onDragEnd={handleDragEnd}
              className={`p-3 border rounded-lg flex justify-between items-center bg-muted ${
                draggedItem?.id === column.id ? "opacity-50" : ""
              }`}
              ref={(el) => {
                if (el) {
                  columnsRef.current[column.position] = el;
                }
              }}
            >
              <span>{column.title}</span>

              <div className="flex gap-2">
                <ColumnTitleUpdateDialog
                  initialTitle={column.title}
                  columnId={column.id}
                />

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(column.id)}
                  disabled={pending}
                >
                  Удалить
                </Button>
              </div>
            </div>
          ))} */}
        </div>
      </div>
    </>
  );
};
