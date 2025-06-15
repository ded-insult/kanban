"use client";
import { ContentLayout } from "@/app/(desks)/(layout)/content-layout";
import { BoardTitleUpdateDialog } from "./(components)/board-title-update-dialog";
import { ColumnCard } from "./(components)/column-card";
import { ColumnCardActions } from "./(components)/column-card-actionts";
import { ColumnCreateForm } from "./(components)/column-create-form";
import { ColumnLayout } from "./(components)/column-layout";
import { useColumnCard } from "./(model)/use-column-card";

export const PageClient = ({
  board,
  boardId,
  columns,
}: {
  board: { id: string; title: string; ownerId: string } | null;
  boardId: string;
  columns: {
    id: string;
    title: string;
    status: string;
    position: number;
    boardId: string;
  }[];
}) => {
  const card = useColumnCard();

  const sortedColumns = [...columns].sort((a, b) => a.position - b.position);
  const newColumnPosition =
    (sortedColumns[sortedColumns.length - 1]?.position || 0) + 1; // +1 чтобы задать новую самую последнюю позицию столбцу

  return (
    <ContentLayout
      header={`${board?.title}`}
      actions={
        <BoardTitleUpdateDialog
          boardId={boardId}
          initialTitle={board?.title || ""}
        />
      }
    >
      <ColumnLayout header="Новый столбец">
        <ColumnCreateForm
          boardId={boardId}
          columnPosition={newColumnPosition}
        />
      </ColumnLayout>

      <ColumnLayout header="Список столбцов">
        {sortedColumns.length ? (
          sortedColumns.map((column) => (
            <ColumnCard
              key={column.id}
              column={column}
              pending={card.pending}
              columnsRef={card.columnsRef}
              onDragEnd={card.handleDragEnd}
              onDragOver={card.handleDragOver(column)}
              onDragStart={card.handleDragStart(column)}
              onDrop={card.handleDrop(column)}
              actions={<ColumnCardActions column={column} />}
            />
          ))
        ) : (
          <h1>Нет доступных столбцов</h1>
        )}
      </ColumnLayout>
    </ContentLayout>
  );
};
