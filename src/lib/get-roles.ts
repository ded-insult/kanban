import { prisma } from "./prisma";

export const getAllRoles = async () => {
  const roles = await prisma.role.findMany();

  return roles;
};
