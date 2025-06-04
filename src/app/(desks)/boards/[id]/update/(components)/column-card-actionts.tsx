"use client";
import { Button } from "@/components/ui/button";
import { ColumnTitleUpdateDialog } from "./column-title-update-dialog";
import { useColumnCard } from "../(model)/use-column-card";
import { BoardColumn } from "@prisma/client";

export const ColumnCardActions = ({ column }: { column: BoardColumn }) => {
  const card = useColumnCard();

  return (
    <>
      <ColumnTitleUpdateDialog
        initialTitle={column.title}
        columnId={column.id}
      />

      <Button
        variant="destructive"
        size="sm"
        onClick={() => card.onDelete(column.id)}
      >
        Удалить
      </Button>
    </>
  );
};
