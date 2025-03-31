"use server";

import { Role, RoleType, User } from "@prisma/client";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import bcryptjs from "bcryptjs";
import { prisma } from "./prisma";
import { routes } from "@/constants/routes";

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
}

export async function login(formData: FormData) {
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;

  const user = await prisma.user.findUnique({
    where: {
      name,
    },
    include: {
      role: true,
    },
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
  redirect(routes.home);
}

export async function logout() {
  const kok = await cookies();
  kok.delete("user");
  redirect(routes.home);
}

export async function getCurrentUser(): Promise<
  (User & { role: Role }) | null
> {
  const userCookie = await cookies();
  const final = userCookie.get("user")?.value;

  if (final) return JSON.parse(final);

  // if (home) redirect(routes.home);
  return null;
}
