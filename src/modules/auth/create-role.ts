"use server";
import { prisma } from "@/lib/prisma";

export const createRole2 = async (name: string) => {
  await prisma.role.create({
    data: {
      name,
    },
  });
};
