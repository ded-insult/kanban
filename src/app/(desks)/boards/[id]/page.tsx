import { getCurrentUser } from "@/shared/lib/auth";
import { getBoardParticipant, getBoard } from "../../(actions)";
import { getBoardTasksGroupedByColumns, getSprints } from "./(actions)";

import { getCurrentSprint } from "../../(actions)/sprint-actions";
import { BoardClientView } from "./(components)/page.client";

export type Board = Awaited<ReturnType<typeof getBoard>>;
export type BoardParticipants = Awaited<ReturnType<typeof getBoardParticipant>>;
export type User = Awaited<ReturnType<typeof getCurrentUser>>;
export type Sprints = Awaited<ReturnType<typeof getSprints>>;
export type Sprint = Awaited<ReturnType<typeof getCurrentSprint>>;
export type Tasks = Awaited<ReturnType<typeof getBoardTasksGroupedByColumns>>;

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [board, user, participants, sprints, tasks, sprint] = await Promise.all(
    [
      getBoard(id),
      getCurrentUser(),
      getBoardParticipant(id),
      getSprints(id),
      getBoardTasksGroupedByColumns(id),
      getCurrentSprint(id),
    ]
  );

  if (!board || !user) return null;

  return (
    <BoardClientView
      board={board}
      sprint={sprint}
      sprints={sprints}
      tasks={tasks}
      user={user}
      participants={participants}
      id={id}
    />
  );
}
