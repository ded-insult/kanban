"use client";
import { Button } from "@/components/ui/button";
import { LinkUI } from "@/components/ui/link";
import { routes } from "@/constants/routes";
import { getCurrentUser } from "@/lib/auth2";
import { can } from "@/lib/permissions";
import React, { useEffect, useState } from "react";
import { getUsersByBoardId, NEED_TO_RENAME_FN } from "../../(actions)";
import { BoardList } from "./board-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SprintSection } from "../../(components)/sprint-section";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const [board, setBoard] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [userList, setUserList] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      const boardData = await NEED_TO_RENAME_FN(resolvedParams.id);
      const userData = await getCurrentUser();
      const users = await getUsersByBoardId(resolvedParams.id);

      setBoard(boardData);
      setUser(userData);
      setUserList(users);
    };
    fetchData();
  }, [resolvedParams.id]);

  if (!board || !user) return null;

  return (
    <>
      <Tabs defaultValue="sprint">
        <TabsList className="flex gap-8 bg-transparent">
          <TabsTrigger
            className="text-xl font-medium px-8 py-4 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 transition-all"
            value="sprint"
          >
            Спринты
          </TabsTrigger>
          <TabsTrigger
            className="text-xl font-medium px-8 py-4 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 transition-all"
            value="desk"
          >
            Доска
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sprint">
          <SprintSection />
        </TabsContent>
        <TabsContent value="desk">
          <div className="min-h-screen bg-gray-50 p-6 relative">
            <div className="max-w-[1800px] mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  {board?.title}
                </h1>

                {can(user.role.role, "board", "update") && (
                  <LinkUI
                    className="cursor-pointer"
                    href={routes.boards.update.replace(
                      ":id",
                      resolvedParams.id
                    )}
                  >
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Обновить доску
                    </Button>
                  </LinkUI>
                )}
              </div>

              <div className="flex gap-6 overflow-x-auto pb-6">
                <BoardList
                  id={resolvedParams.id}
                  user={user}
                  userList={userList}
                  board={board}
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
