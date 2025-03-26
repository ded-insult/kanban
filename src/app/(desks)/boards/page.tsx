import { ProtectedRoute } from "@/modules/auth/auth-context";
import { BoardsList } from "../(components)/boards-list";
import { getCurrentUser } from "@/lib/auth2";
import { Button } from "@/components/ui/button";
import { LinkUI } from "@/components/ui/link";
import { routes } from "@/constants/routes";
import { checkAdmin } from "@/lib/check-admin";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect(routes.home);

  const admin = await checkAdmin(user);
  return (
    <ProtectedRoute user={user}>
      {admin && (
        <Button>
          <LinkUI theme="light" href={routes.boards.create}>
            Создать доску
          </LinkUI>
        </Button>
      )}

      <BoardsList />
    </ProtectedRoute>
  );
}
