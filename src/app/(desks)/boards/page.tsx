import { ProtectedRoute } from "@/app/(protected)/protected-route";
import { ProjectCard } from "./(components)/project-card";
import { getCurrentUser } from "@/shared/lib/auth";
import { routes } from "@/shared/constants/routes";
import { redirect } from "next/navigation";
import { ContentLayout } from "../(components)/content-layout";
import { ProjectActions } from "./(components)/project-actions";
import { prisma } from "@/shared/lib/prisma";
import { checkAdminV2 } from "@/shared/lib/check-admin";

export default async function Page() {
  const [user, boards] = await Promise.all([
    getCurrentUser(),
    prisma.board.findMany(),
  ]);

  if (!user) redirect(routes.home);

  return (
    <ProtectedRoute user={user}>
      <ContentLayout
        actions={<ProjectActions canCreateBoard={checkAdminV2(user)} />}
        header="Проектные доски"
      >
        {boards.length ? (
          boards.map((board) => <ProjectCard key={board.id} board={board} />)
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">Нет доступных досок</p>
          </div>
        )}
      </ContentLayout>
    </ProtectedRoute>
  );
}
