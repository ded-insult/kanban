import { Card } from "@/components/ui/card";
import { BoardColumn } from "@prisma/client";

export const BoardColumnLayout = ({
  column,
  canCreatetask,
  children,
  onDragEnter,
}: {
  column: BoardColumn;
  canCreatetask: boolean;
  onDragEnter: (value: string) => void;
  children: React.ReactNode;
}) => {
  return (
    <>
      <Card.Wrapper
        key={column.id}
        onDragEnter={() => {
          onDragEnter(column.id);
        }}
        className={`w-80 bg-gray-100 rounded-xl p-4 flex-shrink-0 flex flex-col ${
          `` // pending ? "pointer-events-none" : ""
        }`}
      >
        <Card.Title className="flex items-center justify-between mb-4 px-2">
          <span>Статус: </span>
          <span className="text-xl text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
            {column.status}
          </span>
        </Card.Title>

        {canCreatetask && (
          <div className="mb-4">
            {/* {sprintId && (
                  <CreateTaskDialog
                    sprintId={sprintId.id}
                    userId={user.id}
                    userRole={user.role.role}
                    boardId={board.id}
                    userList={userList}
                    columnId={column.id}
                  />
                )} */}
          </div>
        )}

        <div className="flex-1 overflow-y-auto">{children}</div>
      </Card.Wrapper>
    </>
  );
};

export const BoardCardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="flex gap-4">{children}</div>;
};
