"use client";
import { Card } from "@/components/ui/card";
import { can } from "@/lib/permissions";
import { Board, BoardColumn, RoleType, User } from "@prisma/client";
import { TaskList } from "../../(components)/tasks-list";

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
}

export const BoardList = ({ board, user, userList }: Props) => {
  const { columns } = board;

  return (
    <>
      {columns.map((column) => (
        <Card.Wrapper
          key={column.id}
          className="w-80 bg-gray-100 rounded-xl p-4 flex-shrink-0 flex flex-col"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const taskId = e.dataTransfer.getData("text/plain");
            if (taskId) {
              const formData = new FormData();
              formData.append("taskId", taskId);
              formData.append("columnId", column.id);
            }
          }}
        >
          <Card.Title className="flex items-center justify-between mb-4 px-2">
            <span>Статус: </span>
            <span className="text-xl text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
              {column.status}
            </span>
          </Card.Title>

          {can(user.role.role, "task", "create") && (
            <div className="mb-4">
              {/* <CreateTaskDialog
                userId={user.id}
                userRole={user.role.role}
                boardId={board.id}
                userList={userList}
                columnId={column.id}
              /> */}
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            <TaskList userList={userList} columnId={column.id} />
          </div>
        </Card.Wrapper>
      ))}
    </>
  );
};
