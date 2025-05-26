"use server";
import { prisma } from "@/lib/prisma";
import { Board, Sprint, Task, TaskPriority } from "@prisma/client";
import { NewTask } from "../(components)/create-task-dialog";

interface Test {
  title: Sprint["title"];
  description: Task["description"];
  priority: TaskPriority;
  startDate: Sprint["startDate"];
  endDate: Sprint["endDate"];
  creatorId: Task["creatorId"];
  sprintId: Sprint["id"];
}

export const deleteSprintTask = async (taskId: Task["id"]) => {
  await prisma.task.delete({
    where: { id: taskId },
  });
};

export const getSprint = async (boardId: Board["id"]) =>
  await prisma.sprint.findMany({
    where: { boardId },
    include: {
      backlog: {
        include: {
          assignee: true,
        },
      },
    },
  });

export const startSprint = async (
  sprintId: Sprint["id"],
  boardId: Board["id"]
) => {
  try {
    // Get the first column of the board
    const firstColumn = await prisma.boardColumn.findFirst({
      where: { boardId },
      orderBy: { position: "asc" },
    });

    if (!firstColumn) {
      throw new Error("Нет колонок на доске");
    }

    // Get all tasks from the sprint
    const sprintTasks = await prisma.task.findMany({
      where: { sprintId },
    });

    // Update all tasks to move them to the first column
    await Promise.all(
      sprintTasks.map((task) =>
        prisma.task.update({
          where: { id: task.id },
          data: { columnId: firstColumn.id },
        })
      )
    );

    // Update sprint status
    await prisma.sprint.update({
      where: { id: sprintId },
      data: { status: "IN_PROGRESS" },
    });

    return { success: true };
  } catch (error) {
    console.error("Error starting sprint:", error);
    throw error;
  }
};

export const deleteSprint = async (sprintId: Sprint["id"]) => {
  try {
    await prisma.task.deleteMany({
      where: { sprintId },
    });

    await prisma.sprint.delete({
      where: { id: sprintId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting sprint:", error);
    throw error;
  }
};

export const getTasksWithSubtasks2 = async (columnId: string) => {
  return await prisma.task.findMany({
    where: { columnId },
    include: {
      subtasks: true,
      assignee: {
        include: {
          role: true,
        },
      },
      creator: {
        select: {
          name: true,
        },
      },
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
          columnId: columnId || "",
        })),
      },
    },
  });
};

export const createSprintTask = async (data: Test) => {
  return await prisma.task.create({
    // data,
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority,
      startDate: data.startDate,
      endDate: data.endDate,
      creatorId: data.creatorId,
      sprintId: data.sprintId,
    },
    include: {
      assignee: true,
    },
  });
};
