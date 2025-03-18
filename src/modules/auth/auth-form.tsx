"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-context";
import { Role } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { loginUser, registerUser } from "./auth";
import { routes } from "@/constants/routes";

export default function AuthForm({ roles }: { roles?: Role[] }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [roleId, setRoleId] = useState<string>();
  const router = useRouter();
  const { setUser, user } = useAuth();
  const [isPending, startTransition] = useTransition(); // Для обработки асинхронных операций

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password || !name || (!isLogin && !roleId)) {
      setError("Все поля должны быть заполнены");
      return;
    }

    startTransition(async () => {
      try {
        if (isLogin) {
          const result = await loginUser({
            name,
            password,
          });

          if (result.success) {
            localStorage.setItem("user", JSON.stringify(result.user));
            setUser(result.user!);
          }
        } else {
          const result = await registerUser({
            name,
            password,
            roleId: roleId as string,
          });

          if (result.success && result.user) {
            setUser({
              name: result.user.name,
              roleId: result.user.roleId,
              password: result.user.password,
            });
            router.push(routes.boards);
          } else {
            setError(result.error || "Что-то пошло не так");
          }
        }
      } catch (err) {
        setError("Произошла ошибка");
      }
    });
  };

  return (
    <>
      {user && <h1>Добро пожаловать, {user.name}!</h1>}

      {!user && (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">
            {isLogin ? "Login" : "Register"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2">
                Username
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded"
                required
                disabled={isPending}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
                disabled={isPending}
              />
            </div>

            {!isLogin && (
              <div className="mb-4">
                <label htmlFor="role" className="block mb-2">
                  Role
                </label>
                <Select onValueChange={setRoleId} disabled={isPending}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выбрать роль" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles?.map((role) => (
                      <SelectItem value={role.id.toString()} key={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
              disabled={isPending}
            >
              {isPending ? "Обработка..." : isLogin ? "Login" : "Register"}
            </button>
          </form>

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="mt-4 text-blue-500 hover:underline"
            disabled={isPending}
          >
            {isLogin ? "Need to register?" : "Already have an account?"}
          </button>
        </div>
      )}
    </>
  );
}
