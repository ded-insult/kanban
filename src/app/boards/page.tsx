import { ProtectedRoute } from "@/modules/auth/auth-context";
import { Boards } from "./boards-async";
import { getCurrentUser } from "@/lib/auth2";

export default async function Page() {
  const user = await getCurrentUser();

  return (
    <ProtectedRoute user={user}>
      <Boards />
    </ProtectedRoute>
  );
}
