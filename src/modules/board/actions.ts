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
