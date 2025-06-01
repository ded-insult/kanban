"use server";
import { prisma } from "@/shared/lib/prisma";
import { Board, Subtask, Task, TaskPriority } from "@prisma/client";

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

export const getBoardParticipant = async (boardId: string) => {
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

export const getBoard = async (id: string) =>
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
