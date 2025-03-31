"use server";
import { prisma } from "@/lib/prisma";
import { Board, RoleType, User } from "@prisma/client";

export const getBoards = async (ownerId: Board["ownerId"]) => {
  return await prisma.board.findMany({
    where: {
      ownerId,
    },
  });
};

export const createBoard = async (data: { title: string; ownerId: string }) => {
  return await prisma.board.create({
    data: {
      title: data.title,
      ownerId: data.ownerId,
      columns: {
        create: [
          { title: "To Do", status: "TODO", position: 0 },
          { title: "In Progress", status: "IN_PROGRESS", position: 1 },
          { title: "Done", status: "DONE", position: 2 },
        ],
      },
    },
    include: { columns: true },
  });
};

// export const createPermission = async (data: {
//   action: PermissionAction;
//   entity: PermissionEntity;
//   description?: string;
// }) => {
//   return await prisma.permission.create({
//     data: {
//       action: data.action,
//       entity: data.entity,
//       description: data.description,
//     },
//   });
// };

// export const getRoles = async (filter?: { roleType?: RoleType }) => {
//   return prisma.role.findMany({
//     where: filter,
//   });
// };

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

export const getUserWithRolesAndBoards = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: true,
      boards: { select: { id: true, title: true } },
      ownedBoards: { select: { id: true, title: true } },
    },
  });
};

// export const getUserPermissions = async (userId: string) => {
//   return await prisma.user.findUnique({
//     where: { id: userId },
//     include: {
//       role: {
//         include: {
//           permissions: true,
//         },
//       },
//     },
//   });
// };

// export const getUserBoardsWithPermissions = async (userId: string) => {
//   return await prisma.user.findUnique({
//     where: { id: userId },
//     include: {
//       ownedBoards: {
//         include: {
//           permissions: {
//             include: {
//               roles: {
//                 where: {
//                   users: { some: { id: userId } },
//                 },
//               },
//             },
//           },
//         },
//       },
//       boards: {
//         include: {
//           owner: { select: { id: true, name: true } },
//           permissions: {
//             include: {
//               roles: {
//                 where: {
//                   users: { some: { id: userId } },
//                 },
//               },
//             },
//           },
//         },
//       },
//       role: {
//         include: {
//           permissions: {
//             include: {
//               boards: { select: { id: true, title: true } },
//             },
//           },
//         },
//       },
//     },
//   });
// };

// export const assignPermissionToRole = async (data: {
//   permissionId: string;
//   roleId: string;
// }) => {
//   return await prisma.role.update({
//     where: { id: data.roleId },
//     data: {
//       permissions: {
//         connect: { id: data.permissionId },
//       },
//     },
//   });
// };

// export const assignPermissionToBoard = async (data: {
//   permissionId: string;
//   boardId: string;
// }) => {
//   return await prisma.board.update({
//     where: { id: data.boardId },
//     data: {
//       permissions: {
//         connect: { id: data.permissionId },
//       },
//     },
//   });
// };
