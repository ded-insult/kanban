import { getCurrentUser } from "@/lib/auth2";
import { LoginForm } from "./(components)/login-form";
import { RegisterFormByAdmin } from "./(components)/register-form-admin";
import { getAllRoles } from "./(actions)";

export default async function Page() {
  const user = await getCurrentUser();
  const roles = await getAllRoles();

  return (
    <div>
      {!user && <LoginForm />}

      {user && <RegisterFormByAdmin roles={roles} />}
    </div>
  );
}
