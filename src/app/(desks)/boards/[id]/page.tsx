"use client";
import { Button } from "@/components/ui/button";
import { LinkUI } from "@/components/ui/link";
import { routes } from "@/constants/routes";
import { getCurrentUser } from "@/lib/auth2";
import { can } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import React, { useEffect, useState } from "react";
import { getUsersByBoardId, moveTaskToColumn, xuyna } from "../../(actions)";
import { BoardList } from "./board-list";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const [board, setBoard] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [userList, setUserList] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      const boardData = await xuyna(resolvedParams.id);
      const userData = await getCurrentUser();
      const users = await getUsersByBoardId(resolvedParams.id);

      setBoard(boardData);
      setUser(userData);
      setUserList(users);
    };
    fetchData();
  }, [resolvedParams.id]);

  const handleDrop = async (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) {
      try {
        await moveTaskToColumn(taskId, columnId);
        // Refresh the board data
        const updatedBoard = await prisma.board.findUnique({
          where: { id: resolvedParams.id },
          include: {
            columns: {
              orderBy: {
                position: "asc",
              },
            },
          },
        });
        setBoard(updatedBoard);
      } catch (error) {
        console.error("Error moving task:", error);
      }
    }
  };

  if (!board || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{board?.title}</h1>

          {can(user.role.role, "board", "update") && (
            <LinkUI
              className="cursor-pointer"
              href={routes.boards.update.replace(":id", resolvedParams.id)}
            >
              <Button className="bg-blue-600 hover:bg-blue-700">
                Обновить доску
              </Button>
            </LinkUI>
          )}
        </div>

        <div className="flex gap-6 overflow-x-auto pb-6">
          <BoardList user={user} userList={userList} board={board} />
        </div>
      </div>
    </div>
  );
}
