import { getCurrentUser } from "@/shared/lib/auth";
import { FormLogin } from "./(components)/form-login";
import { FormCreateUser } from "./(components)/form-create-user";
import { getAllRoles } from "./(actions)";
import { checkAdminV2 } from "@/shared/lib/check-admin";
import { RoleType } from "@prisma/client";

export default async function Page() {
  const user = await getCurrentUser();
  const roles = await getAllRoles();

  return (
    <div>
      {!user && <FormLogin />}

      {checkAdminV2(user?.role.role || (RoleType.DEVELOPER as any)) && (
        <FormCreateUser roles={roles} />
      )}
    </div>
  );
}
