"use server";
import { prisma } from "@/lib/prisma";
import { Board, Sprint, Task, TaskPriority } from "@prisma/client";

interface Test {
  title: Sprint["title"];
  description: Task["description"];
  priority: TaskPriority;
  startDate: Sprint["startDate"];
  endDate: Sprint["endDate"];
  creatorId: Task["creatorId"];
  sprintId: Sprint["id"];
}

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

export const endSprint = async (boardId: Board["id"]) => {
  try {
    // Find the active sprint
    const activeSprint = await prisma.sprint.findFirst({
      where: {
        boardId,
        status: "IN_PROGRESS",
      },
    });

    if (!activeSprint) {
      throw new Error("Нет активных спринтов");
    }

    // Clear column assignments for all tasks in the sprint
    await prisma.task.updateMany({
      where: {
        sprintId: activeSprint.id,
        NOT: { columnId: null },
      },
      data: {
        columnId: null,
        sprintId: activeSprint.id,
      },
    });

    // Update sprint status to completed
    await prisma.sprint.update({
      where: { id: activeSprint.id },
      data: { status: "COMPLETED" },
    });

    return { success: true };
  } catch (error) {
    console.error("Error ending sprint:", error);
    throw error;
  }
};

export const getCurrentSprint = async (boardId: Board["id"]) => {
  return await prisma.sprint.findFirst({
    where: {
      boardId,
      status: "IN_PROGRESS",
    },
  });
};
