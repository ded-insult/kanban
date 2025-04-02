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
    where: { id },
    include: { columns: true },
  });
  const user = await getCurrentUser();
  if (!user) redirect(routes.home);

  const userList = await getUsersByBoardId(id);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{board?.title}</h1>

          {can(user.role.role, "board", "update") && (
            <LinkUI
              className="cursor-pointer"
              href={routes.boards.update.replace(":id", id)}
            >
              <Button className="bg-blue-600 hover:bg-blue-700">
                Обновить доску
              </Button>
            </LinkUI>
          )}
        </div>

        <div className="flex gap-6 overflow-x-auto pb-6">
          {board?.columns.map((column) => (
            <Card.Wrapper
              key={column.id}
              className="w-80 bg-gray-100 rounded-xl p-4 flex-shrink-0 flex flex-col"
            >
              <Card.Title className="flex items-center justify-between mb-4 px-2">
                {/* <h3 className="font-semibold text-gray-700">{column.title}</h3> */}
                <span>Статус: </span>
                <span className="text-xl text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                  {column.status}
                </span>
              </Card.Title>

              {can(user.role.role, "task", "create") && (
                <div className="mb-4">
                  <CreateTaskDialog userList={userList} columnId={column.id} />
                </div>
              )}

              <div className="flex-1 overflow-y-auto">
                <TaskList userList={userList} columnId={column.id} />
              </div>
            </Card.Wrapper>
          ))}
        </div>
      </div>
    </div>
  );
}
