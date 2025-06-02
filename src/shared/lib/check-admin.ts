import { Role, User } from "@prisma/client";
import { prisma } from "./prisma";

/**
 * @deprecated Юзать `checkAdminV2` вместо этой функции.
 */
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

export const checkAdminV2 = (user: User & { role: Role }) => {
  if (user?.role?.role === "ADMIN") return true;
  return false;
};
