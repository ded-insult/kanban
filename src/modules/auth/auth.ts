"use server"; // Указывает, что это серверный код

import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";

interface RegisterUserInput {
  name: string;
  password: string;
  roleId: string; // Предполагается, что roleId — строка, адаптируйте под вашу модель
}

export async function registerUser({
  name,
  password,
  roleId,
}: RegisterUserInput) {
  const hashedPassword = await bcryptjs.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        password: hashedPassword,
        roleId,
      },
    });

    return {
      success: true,
      user: { name: user.name, roleId: user.roleId, password: user.password },
    };
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return { success: false, error: "Пользователь уже существует" };
    }
    return { success: false, error: "Ошибка регистрации" };
  }
}

// Добавьте функцию для логина, если нужно
export async function loginUser({
  name,
  password,
}: {
  name: string;
  password: string;
}) {
  try {
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
      return { success: false, error: "Неверное имя пользователя или пароль" };
    }

    return {
      success: true,
      user: { name: user.name, roleId: user.roleId },
    };
  } catch (error) {
    return { success: false, error: "Ошибка входа" };
  }
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, roleId: true },
  });
  return user;
}
