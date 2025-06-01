import { ProtectedRoute } from "@/app/(protected)/protected-route";
import { BoardsList } from "./(components)/boards-list";
import { getCurrentUser } from "@/shared/lib/auth";
import { routes } from "@/shared/constants/routes";
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
