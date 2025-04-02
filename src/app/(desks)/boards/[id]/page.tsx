import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LinkUI } from "@/components/ui/link";
import { routes } from "@/constants/routes";
import { getCurrentUser } from "@/lib/auth2";
import { can } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import React from "react";
import { CreateTaskDialog } from "../../(components)/create-task-dialog";
import { getUsersByBoardId } from "../../(actions)";
import { TaskList } from "../../(components)/tasks-list";

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
    include: {
      columns: true,
    },
  });
  const user = await getCurrentUser();
  if (!user) redirect(routes.home);

  const userList = await getUsersByBoardId(id);

  return (
    <div>
      <h1>{board?.title}</h1>

      {can(user.role.role, "board", "update") && (
        <LinkUI
          className="cursor-pointer"
          href={routes.boards.update.replace(":id", id)}
        >
          <Button>Обновить доску</Button>
        </LinkUI>
      )}

      <div className="flex gap-4">
        {board?.columns.map((column) => (
          <Card.Wrapper key={column.id} className="w-64 p-6 flex-shrink-0">
            <Card.Title className="text-align-center">
              <h3>{column.title}</h3>
            </Card.Title>

            <TaskList columnId={column.id} />

            {can(user.role.role, "task", "create") && (
              <Card.Footer>
                {/* <Button variant="default">Создать карточку</Button> */}
                <CreateTaskDialog userList={userList} columnId={column.id} />
              </Card.Footer>
            )}
          </Card.Wrapper>
        ))}
      </div>
    </div>
  );
}
