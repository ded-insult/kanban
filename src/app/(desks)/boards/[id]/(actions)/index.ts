"use server";
import { prisma } from "@/shared/lib/prisma";
import { Board, Prisma, Sprint, Task, TaskPriority } from "@prisma/client";
import { NewTask } from "../(components)/create-task-extened-dialog";
import { cookies } from "next/headers";
import { User } from "../page";

interface Test {
  title: Sprint["title"];
  description: Task["description"];
  priority: TaskPriority;
  startDate: Sprint["startDate"];
  endDate: Sprint["endDate"];
  creatorId?: Task["creatorId"];
  sprintId: Sprint["id"];
}

export const deleteSprintTask = async (taskId: Task["id"]) => {
  await prisma.task.delete({
    where: { id: taskId },
  });
};

export const getSprints = async (boardId: Board["id"]) =>
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
  // creatorId,
  priority,
  approved = false,
}: NewTask) => {
  const cookie = (await cookies()).get("user")?.value;

  if (!cookie) {
    throw new Error("No user found");
  }

  const user = (await JSON.parse(cookie)) as User;

  if (!user) {
    throw new Error("No user found");
  }

  console.log(user, "bebra");

  return await prisma.task.create({
    data: {
      creatorId: user.id,
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
  const cookie = (await cookies()).get("user")?.value;

  if (!cookie) {
    throw new Error("No user found");
  }

  const user = JSON.parse(cookie) as User;

  if (!user) {
    throw new Error("No user found");
  }

  return await prisma.task.create({
    // data,
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority,
      startDate: data.startDate,
      endDate: data.endDate,
      // creatorId: data.creatorId,
      creatorId: user?.id,
      sprintId: data.sprintId,
    },
    include: {
      assignee: true,
    },
  });
};

export const getBoardTasksGroupedByColumns = async (boardId: string) => {
  const columns = await prisma.boardColumn.findMany({
    where: { boardId },
    orderBy: { position: "asc" },
    include: {
      tasks: {
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
          creator: {
            select: {
              id: true,
              name: true,
            },
          },
          subtasks: {
            include: {
              assignee: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return columns.map((column) => ({
    columnId: column.id,
    columnTitle: column.title,
    tasks: column.tasks,
  }));
};

const fullTaskWithRelations = Prisma.validator<Prisma.TaskInclude>()({
  assignee: {
    select: {
      id: true,
      name: true,
      role: true,
    },
  },
  creator: {
    select: {
      id: true,
      name: true,
    },
  },
  subtasks: {
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
});

export type FullTask = Prisma.TaskGetPayload<{
  include: typeof fullTaskWithRelations;
}>;
