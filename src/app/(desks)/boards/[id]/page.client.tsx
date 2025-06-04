"use client";

import { ContentLayout } from "@/app/(desks)/(layout)/content-layout";
import { can } from "@/shared/lib/permissions";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { Board, BoardParticipants, Sprint, Sprints, Tasks, User } from "./page";
import { BoardActions } from "./(components)/(board)/board-actions";
import { BoardColumnLayout } from "./(components)/(board)/board-column-layout";
import { BoardColumnTaskCard } from "./(components)/(board)/board-column-task-card";
import { BoardContentLayout } from "./(components)/(board)/board-content-layout";
import { useDragColumnCard } from "./(components)/(board)/model/use-drag-column-card";
import {
  canDeleteSprint,
  canDeleteTask,
  canStartSprint,
} from "./(components)/(sprint)/model/control";
import { SprintCard } from "./(components)/(sprint)/sprint-card";
import { BoardCreateTaskExtendedDialog } from "./(components)/(board)/board-create-task-extened-dialog";
import { SprintCreateTaskDialog } from "./(components)/(sprint)/sprint-create-task-dialog";
import {
  canUpdateBoard,
  canUpdateSprint,
} from "./(components)/(board)/model/control";
import { BoardProvider } from "./(components)/(board)/board-context";
import { BoardEditTaskDialog } from "@/app/(desks)/boards/[id]/(components)/(board)/board-edit-task-dialog";
import { SprintCreateDialog } from "./(components)/(sprint)/sprint-create-dialog";

interface Props {
  id: string;
  board: Board;
  user: User;
  participants: BoardParticipants;
  sprints: Sprints;
  sprint: Sprint;
  tasks: Tasks;
}

export const BoardClientView = ({
  id,
  board,
  user,
  participants,
  sprints,
  sprint,
  tasks,
}: Props) => {
  const draggable = useDragColumnCard();

  return (
    <BoardProvider initialUser={user}>
      <Tabs defaultValue="sprint">
        <TabsList className="flex gap-8 bg-transparent">
          <TabsTrigger
            className="cursor-pointer border-b-2 text-xl font-medium px-8 py-4 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 transition-all"
            value="sprint"
          >
            Спринты
          </TabsTrigger>
          <TabsTrigger
            className="cursor-pointer border-b-2 text-xl font-medium px-8 py-4 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 transition-all"
            value="desk"
          >
            Доска
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sprint">
          <ContentLayout header="Спринты" actions={<SprintCreateDialog />}>
            {sprints.length ? (
              sprints.map((sprint) => (
                <SprintCard
                  key={sprint.id}
                  sprint={sprint}
                  boardId={id}
                  canDeleteSprint={canDeleteSprint(user, sprint)}
                  canDeleteCardTask={canDeleteTask(user, sprint)}
                  canStart={canStartSprint(sprints, sprint)}
                  bottomRightAction={
                    <SprintCreateTaskDialog sprintId={sprint.id} />
                  }
                />
              ))
            ) : (
              <h1 className="text-2xl font-bold text-gray-900">
                Создайте спринт, у вас нет активных спринтов
              </h1>
            )}
          </ContentLayout>
        </TabsContent>

        <TabsContent value="desk">
          <ContentLayout
            header={board?.title ?? ""}
            actions={
              <BoardActions
                canUpdateBoard={canUpdateBoard(user!.role.role)}
                boardId={id}
                canUpdateSprint={
                  sprint?.status === "IN_PROGRESS" &&
                  canUpdateSprint(user!.role.role)
                }
              />
            }
          >
            <BoardContentLayout>
              {board?.columns.length ? (
                board?.columns.map((column) => (
                  <BoardColumnLayout
                    key={column.id}
                    column={column}
                    onDragEnter={draggable.onDragEnter}
                  >
                    <BoardCreateTaskExtendedDialog
                      boardId={id}
                      canAddParticipant={can(
                        user!.role.role,
                        "board",
                        "update"
                      )}
                      sprintId={sprint?.id ?? ""}
                      columnId={column.id}
                      userList={participants}
                    />

                    {tasks
                      .filter((group) => group.columnId === column.id)
                      .flatMap((group) =>
                        group.tasks.map((task) => (
                          <BoardColumnTaskCard
                            key={task.id}
                            task={task}
                            edit={
                              <BoardEditTaskDialog
                                task={task}
                                userList={participants}
                                canDelete={can(
                                  user?.role.role,
                                  "task",
                                  "delete"
                                )}
                              />
                            }
                            onDragEnd={draggable.onDragEnd}
                            onDragStart={draggable.onDragStart}
                          />
                        ))
                      )}
                  </BoardColumnLayout>
                ))
              ) : (
                <h1 className="text-2xl font-bold mb-6">
                  Сейчас нет ни одной колонки
                </h1>
              )}
            </BoardContentLayout>
          </ContentLayout>
        </TabsContent>
      </Tabs>
    </BoardProvider>
  );
};
