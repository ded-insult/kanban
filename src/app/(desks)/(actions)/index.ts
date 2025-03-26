"use server";
import { prisma } from "@/lib/prisma";
import { Board, BoardColumn } from "@prisma/client";
import { revalidatePath } from "next/cache";

export interface BoardData {
  title: Board["title"];
  ownerId: Board["ownerId"];
  columns?: BoardColumn[];
}

export interface BoardColumnData {
  boardId: BoardColumn["boardId"];
  status: BoardColumn["status"];
  title: BoardColumn["title"];
  position: BoardColumn["position"];
}

export const createBoard = async ({ columns, ownerId, title }: BoardData) => {
  return await prisma.board.create({
    data: {
      title,
      ownerId,
      columns: {
        create: columns,
      },
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

export const deleteBoardColumn = async (id: string) => {
  await prisma.boardColumn.delete({
    where: {
      id,
    },
  });
};

export const getBoardById = async (id: Board["id"]) => {
  return await prisma.board.findUnique({
    where: {
      id,
    },
  });
};

export const getBoardColumnsById = async (boardId: string) => {
  return await prisma.boardColumn.findMany({
    where: {
      boardId,
    },
  });
};
