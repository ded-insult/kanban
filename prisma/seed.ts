import { prisma } from "@/shared/lib/prisma";

async function main() {
  // Создание роли ADMIN (если нет)
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: {
      name: "ADMIN",
      role: "ADMIN",
      description: "Администратор",
    },
  });

  // Создание пользователя admin/admin
  await prisma.user.upsert({
    where: { name: "admin" },
    update: {},
    create: {
      name: "admin",
      password: "admin", // ты не используешь bcrypt
      roleId: adminRole.id,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
