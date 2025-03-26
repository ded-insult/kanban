"use server";
import { prisma } from "@/lib/prisma";
import { Board, BoardColumn } from "@prisma/client";

export interface BoardData {
  title: Board["title"];
  ownerId: Board["ownerId"];
  columns?: BoardColumn[];
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

export interface BoardColumnData {
  boardId: BoardColumn["boardId"];
  status: BoardColumn["status"];
  title: BoardColumn["title"];
}

export const createBoardColumn = async ({
  boardId,
  status,
  title,
}: BoardColumnData) => {
  return prisma.boardColumn.createMany({
    data: {
      boardId,
      status,
      title,
    },
  });
};
