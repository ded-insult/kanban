"use server";

import { prisma } from "@/shared/lib/prisma";
import { Board } from "@prisma/client";

export interface BoardData {
  title: Board["title"];
  ownerId: Board["ownerId"];
}
export const createBoard = async ({ ownerId, title }: BoardData) => {
  return await prisma.board.create({
    data: {
      title,
      ownerId,
      columns: { create: [] },
    },
  });
};
