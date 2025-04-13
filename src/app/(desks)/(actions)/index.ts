"use server";
import { prisma } from "@/lib/prisma";
import {
  Board,
  BoardColumn,
  Subtask,
  Task,
  TaskPriority,
} from "@prisma/client";
import { NewTask } from "../(components)/create-task-dialog";

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
  creatorId: string;
  description?: string;
  columnId: string;
  sectionId?: string | null;
  assigneeId?: string;
  sprintId?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  subtasks?: string[];
  approved?: boolean;
  priority: TaskPriority;
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
  creatorId,
  priority,
  approved = false,
}: NewTask) => {
  return await prisma.task.create({
    data: {
      creatorId,
      title,
      description,
      columnId,
      sectionId,
      assigneeId,
      sprintId,
      startDate,
      endDate,
      priority,
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

interface UpdateTaskData {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  subtasks: Subtask[];
  assigneeId: Task["assigneeId"];
}

export const updateTask = async ({
  id,
  title,
  description,
  priority,
  subtasks,
  assigneeId,
}: UpdateTaskData) => {
  return await prisma.task.update({
    where: { id },
    data: {
      title,
      description,
      assigneeId,
      priority,
      subtasks: {
        updateMany: subtasks.map((subtask) => ({
          where: { id: subtask.id },
          data: {
            title: subtask.title,
            completed: subtask.completed,
          },
        })),
      },
    },
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

export const getTasksWithSubtasks2 = async (columnId: string) => {
  return await prisma.task.findMany({
    where: {
      columnId,
    },
    include: {
      subtasks: true,
      assignee: {
        include: {
          role: true,
        },
      },
    },
  });
};

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

export const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      role: true,
    },
  });
};

export const addUserToBoard = async (boardId: string, userId: string) => {
  return await prisma.board.update({
    where: { id: boardId },
    data: {
      users: {
        connect: { id: userId },
      },
    },
  });
};

export const deleteTask = async (id: string) => {
  return await prisma.task.delete({
    where: { id },
  });
};

export const moveTaskToColumn = async (taskId: string, newColumnId: string) => {
  await prisma.task.update({
    where: { id: taskId },
    data: { columnId: newColumnId },
  });
};

export const NEED_TO_RENAME_FN = async (id: string) =>
  await prisma.board.findUnique({
    where: { id },
    include: {
      columns: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

export const getTaskCreator = async (creatorId: string) => {
  return await prisma.user.findUnique({
    where: { id: creatorId },
    select: {
      id: true,
      name: true,
      role: true,
    },
  });
};
