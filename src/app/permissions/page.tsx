import { ProtectedRoute } from "@/modules/auth/auth-context";
import { PermissionsList } from "./permissions-list";
import { getCurrentUser } from "@/lib/auth2";

export default async function Page() {
  const user = await getCurrentUser();

  return (
    <ProtectedRoute user={user}>
      <h1>Мои доступы:</h1>

      {user && <PermissionsList user={user} />}
    </ProtectedRoute>
  );
}
