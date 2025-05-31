import { Button } from "@/components/ui/button";
import { LinkUI } from "@/components/ui/link";
import { routes } from "@/constants/routes";
import { getCurrentUser } from "@/lib/auth2";
import { prisma } from "@/lib/prisma";
import { RegisterFormByAdmin } from "@/app/(auth)/login/(components)/register-form-admin";
import { checkAdminV2 } from "@/lib/check-admin";
import { Role, User } from "@prisma/client";

export default async function Home() {
  const [user, roles] = await Promise.all([
    getCurrentUser(),
    prisma.role.findMany(),
  ]);

  return (
    <div>
      {user && <h1>Добро пожаловать, {user.name}!</h1>}
      {!user && <h1>Добро пожаловать, войдите в аккаунт</h1>}

      {!user && (
        <LinkUI href={routes.login}>
          <Button>Войти</Button>
        </LinkUI>
      )}

      {checkAdminV2(user as User & { role: Role }) && (
        <RegisterFormByAdmin roles={roles} />
      )}
    </div>
  );
}
