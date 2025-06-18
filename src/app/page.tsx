import { Button } from "@/components/ui/button";
import { LinkUI } from "@/components/ui/link";
import { routes } from "@/shared/constants/routes";
import { getCurrentUser } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { FormCreateUser } from "@/app/(auth)/login/(components)/form-create-user";
import { checkAdminV2 } from "@/shared/lib/check-admin";
import { Role, User } from "@prisma/client";

export default async function Home() {
  const [user, roles] = await Promise.all([
    getCurrentUser(),
    prisma.role.findMany(),
  ]);

  const isAdmin = checkAdminV2(user as User & { role: Role });

  return (
    <div className="max-w-4xl mx-auto p-6">
      {user && (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Добро пожаловать, {user.name}!</h1>

          {!isAdmin && (
            <>
              <div className="prose">
                <p className="text-lg">
                  Мы рады видеть вас в нашей системе управления проектами. Здесь
                  вы можете:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Просматривать и работать с досками проектов</li>
                  <li>Отслеживать задачи и их статусы</li>
                  <li>Взаимодействовать с другими участниками команды</li>
                </ul>
              </div>

              <div className="flex gap-4 mt-6">
                <LinkUI href={routes.boards.initial}>
                  <Button size="lg">Перейти к доскам</Button>
                </LinkUI>
                <LinkUI href={routes.permissions}>
                  <Button variant="outline" size="lg">
                    Мои доступы
                  </Button>
                </LinkUI>
              </div>
            </>
          )}
        </div>
      )}

      {!user && (
        <>
          <h1 className="text-3xl font-bold mb-6">
            Добро пожаловать, войдите в аккаунт
          </h1>

          <LinkUI href={routes.login}>
            <Button size="lg">Войти</Button>
          </LinkUI>
        </>
      )}

      {isAdmin && (
        <div className="mt-8">
          <FormCreateUser roles={roles} />
        </div>
      )}
    </div>
  );
}
