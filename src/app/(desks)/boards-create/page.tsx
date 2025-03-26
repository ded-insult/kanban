import React from "react";
import { ProtectedRoute } from "@/modules/auth/auth-context";
import { getCurrentUser } from "@/lib/auth2";
import { redirect } from "next/navigation";
import { routes } from "@/constants/routes";
import { CreateBoardForm } from "../(components)/create-board-form";

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) redirect(routes.home);

  return (
    <ProtectedRoute user={user}>
      <h1>Форма для создания доски</h1>

      <CreateBoardForm />
    </ProtectedRoute>
  );
}
