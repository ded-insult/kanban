import { getCurrentUser } from "@/shared/lib/auth";
import { FormLogin } from "./(components)/form-login";
import { FormCreateUser } from "./(components)/form-create-user";
import { getAllRoles } from "./(actions)";

export default async function Page() {
  const user = await getCurrentUser();
  const roles = await getAllRoles();

  return (
    <div>
      {!user && <FormLogin />}

      {user && <FormCreateUser roles={roles} />}
    </div>
  );
}
