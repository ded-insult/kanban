"use server";
import { prisma } from "@/lib/prisma";
import { Role, User } from "@prisma/client";

export const getAllRoles = async () => {
  return await prisma.role.findMany();
};

export const createRoleByName = async (name: Role["name"]) => {
  return await prisma.role.create({
    data: {
      name,
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
