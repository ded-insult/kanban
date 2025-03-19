import { Role } from "@prisma/client";
import { prisma } from "./prisma";

export const getAllRoles = async () => {
  return await prisma.role.findMany();
};

export const getRoleById = (id: Role["id"]) => {
  return prisma.role.findUnique({
    where: {
      id,
    },
  });
};
