import { ProtectedRoute } from "@/app/(protected)/protected-route";
import { getCurrentUser } from "@/shared/lib/auth";
import { routes } from "@/shared/constants/routes";
import { redirect } from "next/navigation";
import { getBoardById, getBoardColumnsById } from "@/app/(desks)/(actions)";
import { UpdateBoardColumnsForm } from "@/app/(desks)/boards/[id]/update/(components)/update-board-columns-form";
import { UpdateBoardTitleDialog } from "@/app/(desks)/boards/[id]/update/(components)/update-board-title-dialog";

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
      <div className="flex">
        <h1 className="text-xl">
          Название доски: <strong>{board?.title}</strong>
        </h1>

        <UpdateBoardTitleDialog
          boardId={id}
          currentTitle={board?.title || ""}
        />
      </div>
      <UpdateBoardColumnsForm columns={columns} boardId={id} />
    </ProtectedRoute>
  );
}
