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

export interface TaskData {
  title: string;
  description?: string;
  columnId: string;
  sectionId?: string | null;
  assigneeId?: string;
  sprintId?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  subtasks?: string[];
  approved?: boolean;
}

export const createTask = async ({
  title,
  description,
  columnId,
  sectionId,
  assigneeId,
  sprintId,
  startDate,
  endDate,
  subtasks = [],
  approved = false,
}: TaskData) => {
  return await prisma.task.create({
    data: {
      title,
      description,
      columnId,
      sectionId,
      assigneeId,
      sprintId,
      startDate,
      endDate,
      approved,
      subtasks: {
        create: subtasks.map((subtaskTitle) => ({
          title: subtaskTitle,
          columnId,
        })),
      },
    },
  });
};

export const getUsersByBoardId = async (boardId: string) => {
  return await prisma.user.findMany({
    where: {
      boards: {
        some: {
          id: boardId,
        },
      },
    },
    select: {
      id: true,
      name: true,
      role: true,
    },
  });
};

export const getTasksWithSubtasks = async (columnId: string) => {
  return await prisma.task.findMany({
    where: {
      columnId,
    },
    include: {
      subtasks: true,
    },
  });
};

export type Zapula = ReturnType<typeof getTasksWithSubtasks>;
