import { ProtectedRoute } from "@/app/(protected)/protected-route";
import { getCurrentUser } from "@/shared/lib/auth";
import { routes } from "@/shared/constants/routes";
import { redirect } from "next/navigation";
import { getBoardById, getBoardColumnsById } from "@/app/(desks)/(actions)";
import { PageClient } from "./page.client";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect(routes.home);

  const { id } = await params;
  const [board, columns] = await Promise.all([
    getBoardById(id),
    getBoardColumnsById(id),
  ]);

  return (
    <ProtectedRoute user={user}>
      <PageClient columns={columns} board={board} boardId={id} />
    </ProtectedRoute>
  );
}
