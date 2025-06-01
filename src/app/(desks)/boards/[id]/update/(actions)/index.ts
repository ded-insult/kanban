"use server";

import { prisma } from "@/shared/lib/prisma";
import { Board, BoardColumn } from "@prisma/client";

export interface BoardColumnData {
  boardId: BoardColumn["boardId"];
  status: BoardColumn["status"];
  title: BoardColumn["title"];
  position: BoardColumn["position"];
}

export const updateBoardTitle = async (
  id: Board["id"],
  title: Board["title"]
) => {
  return await prisma.board.update({
    data: {
      title,
    },
    where: {
      id,
    },
  });
};

export const createBoardColumn = async ({
  boardId,
  status,
  title,
  position,
}: BoardColumnData) => {
  return prisma.boardColumn.createMany({
    data: {
      boardId,
      status,
      title,
      position,
    },
  });
};

export const deleteBoardColumn = async (id: string) => {
  await prisma.boardColumn.delete({
    where: {
      id,
    },
  });
};

export const moveBoardColumnPosition = async ({
  columnId,
  newPosition,
}: {
  columnId: BoardColumn["boardId"];
  newPosition: BoardColumn["position"];
}) => {
  return await prisma.boardColumn.update({
    where: { id: columnId },
    data: { position: newPosition },
  });
};

export const updateBoardColumn = async ({
  id,
  title,
  status,
}: {
  id: string;
  title: string;
  status: string;
}) => {
  return await prisma.boardColumn.update({
    where: { id },
    data: { title, status },
  });
};
