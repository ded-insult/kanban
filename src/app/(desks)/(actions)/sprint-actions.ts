"use server";
import { prisma } from "@/shared/lib/prisma";
import { Board, Sprint } from "@prisma/client";

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
    const activeSprint = await prisma.sprint.findFirst({
      where: {
        boardId,
        status: "IN_PROGRESS",
      },
    });

    if (!activeSprint) {
      throw new Error("Нет активных спринтов");
    }

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
