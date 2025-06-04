import { Card } from "@/components/ui/card";

export const BoardColumnLayout = ({
  column,
  children,
  onDragEnter,
}: {
  column: { id: string; status: string };
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
        className={`w-80 bg-gray-100 rounded-xl p-4 flex-shrink-0 flex flex-col`}
      >
        <Card.Title className="flex items-center justify-between mb-4 px-2">
          <span>Статус: </span>
          <span className="text-xl text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
            {column.status}
          </span>
        </Card.Title>

        <div className="flex-1 overflow-y-auto">{children}</div>
      </Card.Wrapper>
    </>
  );
};
