import React from "react";
import { ProtectedRoute } from "@/app/(protected)/protected-route";
import { getCurrentUser } from "@/shared/lib/auth";
import { redirect } from "next/navigation";
import { routes } from "@/shared/constants/routes";
import { CreateBoardForm } from "./(components)/create-board-form";

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
