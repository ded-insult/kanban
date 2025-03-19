"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
import { login, logout } from "@/lib/auth2";
import { LoginForm } from "./login-form";

export default function AuthForm({ permissions }: { permissions?: any }) {
  // const [isLogin, setIsLogin] = useState(true);
  // const [name, setName] = useState("");
  // const [password, setPassword] = useState("");
  // const [error, setError] = useState("");
  // const [roleId, setRoleId] = useState<string>();
  // const router = useRouter();
  // // const { setUser, user } = useAuth();
  // const user = null;
  // const [isPending, startTransition] = useTransition(); // Для обработки асинхронных операций

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");

  //   if (!password || !name || (!isLogin && !roleId)) {
  //     setError("Все поля должны быть заполнены");
  //     return;
  //   }

  //   startTransition(async () => {
  //     try {
  //       if (isLogin) {
  //         const result = await loginUser({
  //           name,
  //           password,
  //         });

  //         if (result.success) {
  //           localStorage.setItem("user", JSON.stringify(result.user));
  //           setUser(result.user!);
  //         }
  //       } else {
  //         const result = await registerUser({
  //           name,
  //           password,
  //           roleId: roleId as string,
  //         });

  //         if (result.success && result.user) {
  //           setUser({
  //             name: result.user.name,
  //             roleId: result.user.roleId,
  //             password: result.user.password,
  //           });
  //           router.push(routes.boards);
  //         } else {
  //           setError(result.error || "Что-то пошло не так");
  //         }
  //       }
  //     } catch (err) {
  //       setError("Произошла ошибка");
  //     }
  //   });
  // };

  return (
    <>
      {/* {user && <h1>Добро пожаловать, {user.name}!</h1>} */}
      {/* 


      <form action={login}>
        <input type="text" name="name" placeholder="Имя" required />
        <input type="password" name="password" placeholder="Пароль" required />
        <button type="submit">Войти</button>
      </form> */}

      {/* {!user && ( */}

      <LoginForm />

      {/* <button
            onClick={() => setIsLogin(!isLogin)}
            className="mt-4 text-blue-500 hover:underline"
            disabled={isPending}
          >
            {isLogin ? "Регистрация?" : "Войти в аккаунт ?"}
          </button> */}
      {/* )} */}
    </>
  );
}
