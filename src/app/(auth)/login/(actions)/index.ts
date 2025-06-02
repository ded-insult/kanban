"use server";
import { prisma } from "@/shared/lib/prisma";
import { Role, RoleType, User } from "@prisma/client";

export const getAllRoles = async () => {
  return await prisma.role.findMany();
};

export const createRoleByName = async (name: Role["name"], role: RoleType) => {
  return await prisma.role.create({
    data: {
      name,
      role,
    },
  });
};

/**
 * @deprecated Использовать registerUserV2
 */
export const createUser = async ({
  name,
  password,
  roleId,
}: {
  name: User["name"];
  password: User["password"];
  roleId: User["roleId"];
}) => {
  return prisma.user.create({
    data: {
      name,
      password,
      roleId,
    },
  });
};

export const registerUserV2 = async (data: {
  username: string;
  password: string;
  roleId: string;
}) => {
  const existingUser = await prisma.user.findUnique({
    where: { name: data.username },
  });

  if (existingUser) {
    throw new Error("Пользователь с таким именем уже существует");
  }

  await prisma.user.create({
    data: {
      name: data.username,
      password: data.password,
      roleId: data.roleId,
    },
  });
};
