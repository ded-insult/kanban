import React from "react";
import { CreateBoardForm } from "./create-board-form";
import { ProtectedRoute } from "@/modules/auth/auth-context";
import { getCurrentUser } from "@/lib/auth2";

export default async function Page() {
  const user = await getCurrentUser();

  return (
    <ProtectedRoute user={user}>
      <div>
        <h1>Форма для создания доски</h1>

        <CreateBoardForm />
      </div>
    </ProtectedRoute>
  );
}
