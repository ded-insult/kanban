import { ProtectedRoute } from "@/modules/auth/auth-context";

export default function Page() {
  return (
    <ProtectedRoute>
      <div>
        <h1>Мои доступы:</h1>

        <ul>
          <li></li>
        </ul>
      </div>
    </ProtectedRoute>
  );
}
