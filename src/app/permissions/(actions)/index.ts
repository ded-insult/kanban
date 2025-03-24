"use server";
import { prisma } from "@/lib/prisma";
import { Board, User } from "@prisma/client";

export const getRoleByUserRoleId = async (
  roleId: User["roleId"],
  name: string,
  boardId: any
) => {
  if (!roleId) return null;

  return await prisma.permission.create({
    data: {
      name,
      boardId,
      roleId,
    },
  });
};

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

export const getBoardByUser = async (id: User["id"]) => {
  return await prisma.user.findUnique({
    where: {
      id,
      //   ownerId,
    },
    include: {
      ownedBoards: true,
    },
  });
};

export const getUser = async () => {};
