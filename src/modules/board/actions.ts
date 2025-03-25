"use server";

import { CreateBoardColumn } from "@/domain/board";

const normalizeStringToBoard = (boards: string[]): CreateBoardColumn[] =>
  boards.reduce((acc, value) => {
    acc.push({
      status: value,
      title: value,
    });
    return acc;
  }, [] as CreateBoardColumn[]);

const createBoard = async (title: string, names: string[]) => {
  const boards = normalizeStringToBoard(names);

  try {
    // const res = await prisma.board.create({
    //   data: {
    //     title,
    //     columns: {
    //       create: [...boards],
    //     },
    //   },
    //   include: {
    //     columns: true,
    //   },
    // });
    const res = "";

    return { success: true, data: res };
  } catch (e) {
    alert("Произошла ошибка, попробуйте еще раз или вернитесь позже");
    if (e instanceof Error) {
      return { success: false, data: e.message };
    } else {
      return { success: false, data: "Unknown error" };
    }
  }
};

export { createBoard };
