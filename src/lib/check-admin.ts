import { User } from "@prisma/client";
import { prisma } from "./prisma";

export const checkAdmin = async (user: User | null) => {
  if (!user) return;

  const value = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      role: true,
    },
  });

  if (value?.role.role === "ADMIN") return true;
  return false;
};
