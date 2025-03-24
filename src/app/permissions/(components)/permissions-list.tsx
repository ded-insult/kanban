import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

export const PermissionsList = async ({ user }: { user?: User }) => {
  const permissions = await prisma.user.findUnique({
    where: {
      id: user?.id ?? "",
    },
    include: {
      role: {
        include: {
          permissions: true,
        },
      },
    },
  });

  return (
    <ul>
      {permissions?.role.permissions.map((permission) => (
        <li key={permission.id}>{permission.name}</li>
      ))}
    </ul>
  );
};
