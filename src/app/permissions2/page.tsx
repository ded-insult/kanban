import { ProtectedRoute } from "@/modules/auth/auth-context";
import { getCurrentUser } from "@/lib/auth2";
import { redirect } from "next/navigation";
import { can } from "@/lib/permissions";
import { actions, entities, roles, translations } from "./(constants)";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }

  return (
    <ProtectedRoute user={user}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">{translations.title}</h1>
        <h2 className="text-1xl font-bold mb-6">Ваша роль подсвечена</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">
                  {translations.tableHeaders.entity}
                </th>
                <th className="border border-gray-300 p-2">
                  {translations.tableHeaders.action}
                </th>
                {roles.map((role) => (
                  <th
                    key={role}
                    className={`border border-gray-300 p-2 ${
                      user.role.role === role ? "bg-blue-200 font-bold" : ""
                    }`}
                  >
                    {translations.roles[role]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entities.map((entity) =>
                actions.map((action, actionIdx) => (
                  <tr key={`${entity}-${action}`}>
                    {actionIdx === 0 && (
                      <td
                        rowSpan={3}
                        className="border border-gray-300 p-2 font-medium"
                      >
                        {
                          translations.entities[
                            entity as keyof typeof translations.entities
                          ]
                        }
                      </td>
                    )}
                    <td className="border border-gray-300 p-2">
                      {
                        translations.actions[
                          action as keyof typeof translations.actions
                        ]
                      }
                    </td>
                    {roles.map((role) => (
                      <td
                        key={`${entity}-${action}-${role}`}
                        className={`border border-gray-300 p-2 text-center ${
                          user.role.role === role
                            ? "bg-blue-100 font-semibold shadow-inner"
                            : ""
                        }`}
                      >
                        {can(role, entity as any, action as any) ? "✅" : "❌"}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
}
