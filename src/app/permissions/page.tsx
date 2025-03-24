import { ProtectedRoute } from "@/modules/auth/auth-context";
import { getCurrentUser } from "@/lib/auth2";
import { checkAdmin } from "@/lib/check-admin";
import { getBoards, getRoles } from "./(actions)";
import { CreatePermissionDialog } from "./(components)/create-permission-dialog";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) return;
  const admin = await checkAdmin(user);
  const boards = await getBoards(user.id);
  const roles = await getRoles();

  return (
    <ProtectedRoute user={user}>
      <h1>Мои доступы:</h1>

      {/* TODO: доделать пермишины */}
      {/* <PermissionsList user={user!} /> */}

      <b>Создать доступ:</b>

      {admin && (
        <CreatePermissionDialog roles={roles} user={user} boards={boards} />
      )}
    </ProtectedRoute>
  );
}
