"use server";
import { prisma } from "@/lib/prisma";
import { Board, Sprint, Task, TaskPriority } from "@prisma/client";

export const getSprint = async (boardId: Board["id"]) =>
  await prisma.sprint.findMany({
    where: { boardId },
    include: {
      backlog: {
        include: {
          assignee: true,
        }
      },
    },
  });

export const createSprintTask = async (data: {
  title: string;
  description?: string;
  priority: TaskPriority;
  creatorId: string;
  columnId: string;
  sprintId: string;
  assigneeId?: string;
}) => {
  return await prisma.task.create({
    data,
    include: {
      assignee: true,
    },
  });
};

export const createSprint = async (data: {
  title: Sprint["title"];
  boardId: Sprint["boardId"];
  startDate: Sprint["startDate"];
  endDate: Sprint["endDate"];
}) => {
  return await prisma.sprint.create({
    data,
  });
};
