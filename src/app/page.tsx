import { Button } from "@/components/ui/button";
import { LinkUI } from "@/components/ui/link";
import { routes } from "@/constants/routes";
import { getCurrentUser } from "@/lib/auth2";
import { prisma } from "@/lib/prisma";
import { RegisterFormByAdmin } from "@/app/(auth)/login/(components)/register-form-admin";

export default async function Home() {
  const user = await getCurrentUser();
  const data = await prisma.user.findUnique({
    where: {
      id: user?.id ?? "",
    },
    include: {
      role: true,
    },
  });
  const roles = await prisma.role.findMany();

  return (
    <div>
      {user && <h1>ДОброй пожаловать, {user.name}!</h1>}
      {!user && <h1>ДОброй пожаловать, войдите в аккаунт</h1>}

      {!user && (
        <LinkUI href={routes.login}>
          <Button>Войти</Button>
        </LinkUI>
      )}

      {data?.role.roleType === "ADMIN" && <RegisterFormByAdmin roles={roles} />}
    </div>
  );
}
