"use client";
import { Card } from "@/components/ui/card";
import { can } from "@/lib/permissions";
import { Board, BoardColumn, RoleType, Task, User } from "@prisma/client";
import { TaskList } from "../../(components)/tasks-list";
import { CreateTaskDialog } from "../../(components)/create-task-dialog";
import { use, useEffect, useState } from "react";
import { moveTaskToColumn, NEED_TO_RENAME_FN } from "../../(actions)";

type NewBoard = Board & {
  columns: BoardColumn[];
};
type NewUser = User & {
  role: {
    role: RoleType;
  };
};
interface Props {
  userList: any[];
  board: NewBoard;
  user: NewUser;
  id: string;
}

interface DragState {
  taskId: string;
  currentColumnId: string;
  targetColumnId: string;
}

const initilDragState: DragState = {
  taskId: "",
  currentColumnId: "",
  targetColumnId: "",
};

type Test = Awaited<ReturnType<typeof NEED_TO_RENAME_FN>>;
export const BoardList = ({ board, user, userList, id }: Props) => {
  const { columns } = board;
  const [boardData, setBoardData] = useState<Test>();
  const [dragState, setDragState] = useState<DragState>(initilDragState);
  const [pending, setPending] = useState(false);

  let refresh = "";

  console.log("refresh");

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    setDragState((p) => ({ ...p, taskId }));
  };

  const onDragEnter = (targetColumnId: string) => {
    setDragState((p) => ({ ...p, targetColumnId }));
  };

  const onDragEnd = async () => {
    if (dragState.currentColumnId === dragState.targetColumnId) {
      return;
    }

    try {
      await moveTaskToColumn(dragState.taskId, dragState.targetColumnId);
      alert("Успех");
      refresh = Math.random().toString();
    } catch (e) {
      alert("Ошибка");
    }
  };

  useEffect(() => {
    NEED_TO_RENAME_FN(id).then(setBoardData);
  }, [id]);

  return (
    <>
      {boardData?.columns.map((column) => (
        <Card.Wrapper
          key={column.id}
          onDragEnter={() => onDragEnter(column.id)}
          className={`w-80 bg-gray-100 rounded-xl p-4 flex-shrink-0 flex flex-col ${
            pending ? "pointer-events-none" : ""
          }`}
        >
          <Card.Title className="flex items-center justify-between mb-4 px-2">
            <span>Статус: </span>
            <span className="text-xl text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
              {column.status}
            </span>
          </Card.Title>

          {can(user.role.role, "task", "create") && (
            <div className="mb-4">
              <CreateTaskDialog
                userId={user.id}
                userRole={user.role.role}
                boardId={board.id}
                userList={userList}
                columnId={column.id}
              />
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            <TaskList
              refreshData={refresh}
              userList={userList}
              columnId={column.id}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              isPending={pending}
            />
          </div>
        </Card.Wrapper>
      ))}
    </>
  );
};
