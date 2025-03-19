// lib/auth.ts
"use server";

import { PrismaClient, User } from "@prisma/client";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

// Регистрация нового пользователя
export async function register(formData: FormData) {
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;

  const user = await prisma.user.create({
    data: {
      name,
      password,
      roleId: "user",
    },
  });

  const cookie = await cookies();
  cookie.set("user", JSON.stringify(user));
  redirect("/dashboard");
}

// Вход пользователя
export async function login(formData: FormData) {
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;

  const user = await prisma.user.findUnique({
    where: { name },
  });

  if (
    !user ||
    !(
      (await bcryptjs.compare(password, user.password)) ||
      password === user.password
    )
  ) {
    throw new Error("Ошибка");
  }

  const cookie = await cookies();
  cookie.set("user", JSON.stringify(user));
  redirect("/");
}

// Выход пользователя
export async function logout() {
  const kok = await cookies();
  kok.delete("user");
  redirect("/");
}

// Получение текущего пользователя
export async function getCurrentUser(): Promise<User | null> {
  const userCookie = await cookies();
  const final = userCookie.get("user")?.value;

  if (final) return JSON.parse(final);

  return null;
}
