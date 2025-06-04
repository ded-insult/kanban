"use client";
import { BoardColumn } from "@prisma/client";
import { DragEvent } from "react";

export const ColumnCard = ({
  column,
  actions,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  columnsRef,
  pending,
}: {
  column: BoardColumn;
  actions: React.ReactNode;
  onDragStart: (e: DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: any) => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onDragEnd: (e: DragEvent<HTMLDivElement>) => void;
  columnsRef: any;
  pending: boolean;
}) => {
  return (
    <div
      draggable={!pending}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`p-3 border rounded-lg flex justify-between items-center bg-muted hover:bg-muted/80 transition-colors cursor-pointer`}
      ref={(el) => {
        if (el) {
          columnsRef.current[column.position] = el;
        }
      }}
    >
      <span>{column.title}</span>

      <div className="flex gap-2">{actions}</div>
    </div>
  );
};
