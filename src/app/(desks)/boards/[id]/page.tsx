import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LinkUI } from "@/components/ui/link";
import { routes } from "@/constants/routes";
import { getCurrentUser } from "@/lib/auth2";
import { checkAdmin } from "@/lib/check-admin";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import React from "react";

// TODO: Здесь должен быть набор Этапов в которых описаваются состояния действий
// Этап 1 - бэклог, этап 2 - в процессе, этап 3 - сделано

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const board = await prisma.board.findUnique({
    where: {
      id: id,
    },
  });
  const user = await getCurrentUser();
  if (!user) redirect(routes.home);

  const admin = await checkAdmin(user);

  const columns = await prisma.boardColumn.findMany({
    where: {
      boardId: id,
    },
  });

  return (
    <div>
      <h1>{board?.title}</h1>

      {admin && (
        <LinkUI
          className="cursor-pointer"
          href={routes.boards.update.replace(":id", id)}
        >
          <button>Обновить доску</button>
        </LinkUI>
      )}

      {/* <div className="flex overflow-x-auto gap-4 pt-4">
        {columns.map((column) => (
          <Card.Wrapper key={column.id} className="w-64 flex-shrink-0">
            <Card.Title className="text-align-center">
              <h3>{column.title}</h3>
            </Card.Title>
            <Card.Footer>
              <Button variant="secondary">Добавить задачу +</Button>
            </Card.Footer>
          </Card.Wrapper>
        ))}
      </div> */}
    </div>
  );
}
