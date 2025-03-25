import { ProtectedRoute } from "@/modules/auth/auth-context";
import { getCurrentUser } from "@/lib/auth2";
import { checkAdmin } from "@/lib/check-admin";
import { getBoards, getRoles } from "./(actions)";
import { CreatePermissionDialog } from "./(components)/create-permission-dialog";
import { redirect } from "next/navigation";
import { PermissionsList } from "./(components)/permissions-list";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }
  const admin = await checkAdmin(user);
  const boards = await getBoards(user.id);
  const roles = await getRoles();

  return (
    <ProtectedRoute user={user}>
      {/* TODO: доделать пермишины */}
      <PermissionsList user={user!} />

      {admin && <b>Создать доступ:</b>}

      {admin && (
        <CreatePermissionDialog roles={roles} user={user} boards={boards} />
      )}
    </ProtectedRoute>
  );
}
