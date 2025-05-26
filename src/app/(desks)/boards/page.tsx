import { ProtectedRoute } from "@/modules/auth/auth-context";
import { BoardsList } from "./(components)/boards-list";
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Проектные доски</h1>
          {admin && (
            <Button className="bg-blue-600 hover:bg-blue-700 transition-colors">
              <LinkUI theme="light" href={routes.boards.create}>
                Создать доску
              </LinkUI>
            </Button>
          )}
        </div>
        <BoardsList />
      </div>
    </ProtectedRoute>
  );
}
