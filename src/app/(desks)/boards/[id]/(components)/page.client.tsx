"use client";

import { ContentLayout } from "@/app/(desks)/(components)/content-layout";
import { SprintDialog } from "@/app/(desks)/(components)/sprint-dialog";
import { can } from "@/lib/permissions";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import {
  Board,
  BoardParticipants,
  Sprint,
  Sprints,
  Tasks,
  User,
} from "../page";
import { BoardActions } from "./(board)/board-actions";
import { BoardColumnLayout } from "./(board)/board-column-layout";
import { BoardColumnTaskCard } from "./(board)/board-column-task-card";
import { BoardContentLayout } from "./(board)/board-content-layout";
import { useDragColumnCard } from "./(board)/model/use-drag-column-card";
import {
  canDeleteSprint,
  canDeleteTask,
  canStartSprint,
} from "./(sprint)/model/control";
import { SprintCard } from "./(sprint)/sprint-card";
import { CreateTaskExtendedDialog } from "./create-task-extened-dialog";
import { CreateTaskDialog } from "./create-task-dialog";

interface Props {
  id: string;
  board: Board;
  user: User;
  userList: BoardParticipants;
  sprints: Sprints;
  sprint: Sprint;
  tasks: Tasks;
}

export const BoardClientView = ({
  id,
  board,
  user,
  userList,
  sprints,
  sprint,
  tasks,
}: Props) => {
  const draggable = useDragColumnCard();

  return (
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
        <ContentLayout header="Спринты" actions={<SprintDialog />}>
          {sprints?.map((sprint) => (
            <SprintCard
              key={sprint.id}
              sprint={sprint}
              boardId={id}
              canDeleteSprint={canDeleteSprint(user, sprint)}
              canDeleteCardTask={canDeleteTask(user, sprint)}
              canStart={canStartSprint(sprints, sprint)}
              bottomRightAction={<CreateTaskDialog sprintId={sprint.id} />}
            />
          ))}
        </ContentLayout>
      </TabsContent>

      <TabsContent value="desk">
        <ContentLayout
          header={board?.title}
          actions={<BoardActions boardId={id} user={user} />}
        >
          <BoardContentLayout>
            {board?.columns.map((column) => (
              <BoardColumnLayout
                key={column.id}
                column={column}
                onDragEnter={draggable.onDragEnter}
                canCreatetask={can(user!.role.role, "task", "create")}
              >
                <CreateTaskExtendedDialog
                  boardId={id}
                  canAddParticipant={can(user!.role.role, "board", "update")}
                  sprintId={sprint?.id ?? ""}
                  columnId={column.id}
                  userList={userList}
                />

                {tasks
                  .filter((group) => group.columnId === column.id)
                  .flatMap((group) =>
                    group.tasks.map((task) => (
                      <BoardColumnTaskCard
                        key={task.id}
                        task={task}
                        onDragEnd={draggable.onDragEnd}
                        onDragStart={draggable.onDragStart}
                      />
                    ))
                  )}
              </BoardColumnLayout>
            ))}
          </BoardContentLayout>
        </ContentLayout>
      </TabsContent>
    </Tabs>
  );
};
