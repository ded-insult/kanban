import { ProtectedRoute } from "@/modules/auth/auth-context";
import { BoardsList } from "./(components)/boards-list";
import { getCurrentUser } from "@/lib/auth2";
import { routes } from "@/constants/routes";
import { redirect } from "next/navigation";
import { ContentLayout } from "../(components)/content-layout";
import { BoardsHeader } from "./(components)/boards-header";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect(routes.home);

  return (
    <ProtectedRoute user={user}>
      <ContentLayout header={<BoardsHeader user={user} />}>
        <BoardsList />
      </ContentLayout>
    </ProtectedRoute>
  );
}
