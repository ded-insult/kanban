"use server";
import { prisma } from "@/lib/prisma";
import { Board, User } from "@prisma/client";

export const getBoards = async (ownerId: Board["ownerId"]) => {
  return await prisma.board.findMany({
    where: {
      ownerId,
    },
  });
};

export const createBoard = async ({
  title,
  ownerId,
}: {
  title: Board["title"];
  ownerId: Board["ownerId"];
}) => {
  return await prisma.board.create({
    data: {
      title,
      ownerId,
    },
  });
};

export const createPermission = async ({
  name,
  boardId,
  roleId,
}: {
  name: User["name"];
  boardId: Board["id"];
  roleId: User["roleId"];
}) => {
  return await prisma.permission.create({
    data: {
      name,
      boardId,
      roleId,
    },
  });
};

export const getRoles = async () => {
  return prisma.role.findMany();
};

export const getBoarsdWithUsers = async (id: User["id"]) => {
  return await prisma.board.findMany({
    where: {
      users: {
        some: {
          id,
        },
      },
    },
    include: {
      users: true,
    },
  });
};

export const getUserWithRolesAndBoards = async (id: User["id"]) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      role: true,
      boards: {
        select: {
          id: true,
          title: true,
        },
      },
      ownedBoards: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
};

export const getLocalPermissions = async (id: User["id"]) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      role: {
        include: {
          permissions: true,
        },
      },
    },
  });
};

export const getUserBoardsWithPermissions = async (userId: string) => {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      ownedBoards: {
        select: {
          id: true,
          title: true,
          permissions: {
            where: {
              role: {
                users: {
                  some: {
                    id: userId,
                  },
                },
              },
            },
            select: {
              name: true,
            },
          },
        },
      },
      boards: {
        select: {
          id: true,
          title: true,
          owner: {
            select: {
              id: true,
              name: true,
            },
          },
          permissions: {
            where: {
              role: {
                users: {
                  some: {
                    id: userId,
                  },
                },
              },
            },
            select: {
              name: true,
            },
          },
        },
      },
      role: {
        select: {
          name: true,
          permissions: {
            select: {
              name: true,
              board: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      },
    },
  });
};
