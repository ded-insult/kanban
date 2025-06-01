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

export const registerUser = async (form: FormData) => {
  const username = form.get("username") as string;
  const password = form.get("password") as string;
  const roleId = form.get("role") as string;

  const existingUser = await prisma.user.findUnique({
    where: { name: username },
  });

  if (existingUser) {
    throw new Error("Пользователь с таким именем уже существует");
  }

  await prisma.user.create({
    data: {
      name: username,
      password,
      roleId,
    },
  });
};
