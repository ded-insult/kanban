import { getCurrentUser } from "@/lib/auth2";
import { LoginForm } from "@/modules/auth/login-form";
import { RegisterFormByAdmin } from "@/modules/auth/register-form-admin";

export default async function Page() {
  const user = await getCurrentUser();

  return (
    <div>
      {!user && <LoginForm />}

      {user && <RegisterFormByAdmin user={user} />}
    </div>
  );
}
