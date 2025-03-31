import { ProtectedRoute } from "@/modules/auth/auth-context";
import { getCurrentUser } from "@/lib/auth2";
import { routes } from "@/constants/routes";
import { redirect } from "next/navigation";
import { getBoardById, getBoardColumnsById } from "@/app/(desks)/(actions)";
import { prisma } from "@/lib/prisma";
import { UpdateBoardColumnsForm } from "@/app/(desks)/(components)/update-board-columns-form";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect(routes.home);

  const { id } = await params;
  const board = await getBoardById(id);
  const columns = await getBoardColumnsById(id);

  return (
    <ProtectedRoute user={user}>
      <h1 className="text-xl">
        Название доски: <strong>{board?.title}</strong>
      </h1>

      <UpdateBoardColumnsForm columns={columns} boardId={id} />
    </ProtectedRoute>
  );
}
