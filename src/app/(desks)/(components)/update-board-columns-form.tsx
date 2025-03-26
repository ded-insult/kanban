// "use client";
// import { useState, useRef } from "react";
// import {
//   BoardColumnData,
//   createBoardColumn,
//   deleteBoardColumn,
//   moveBoardColumnPosition,
// } from "../(actions)";
// import { BoardColumn } from "@prisma/client";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// type ColumnData = Omit<BoardColumnData, "boardId" | "position">;
// const initialFormData: ColumnData = {
//   status: "",
//   title: "",
// };

// export const UpdateBoardColumnsForm = ({
//   boardId,
//   columns: initialColumns,
// }: {
//   boardId: BoardColumn["boardId"];
//   columns: BoardColumn[];
// }) => {
//   const [formData, setFormData] = useState<ColumnData>(initialFormData);
//   const [draggedItem, setDraggedItem] = useState<BoardColumn | null>(null);
//   const [pending, setPending] = useState(false);

//   const columnsRef = useRef<HTMLDivElement[]>([]);

//   const sortedColumns = [...initialColumns].sort(
//     (a, b) => a.position - b.position
//   );
//   const maxPosition = sortedColumns[sortedColumns.length - 1]?.position || 0;

//   const onDelete = async (id: string) => {
//     try {
//       await deleteBoardColumn(id);
//     } catch (e) {
//       alert("Ошибка");
//     }
//   };
//   const handleDragStart = (
//     e: React.DragEvent<HTMLDivElement>,
//     column: BoardColumn
//   ) => {
//     if (pending) {
//       e.preventDefault();
//       return;
//     }
//     e.dataTransfer.setData("text/plain", column.id);
//     setDraggedItem(column);
//     (e.target as HTMLElement).style.opacity = "0.4";
//   };

//   const onChangeTitle = (title: string) => {
//     setFormData((p) => ({ ...p, title, status: title }));
//   };

//   const onCreateColumn = async () => {
//     if (!formData.title) {
//       alert("Заполните поле");
//       return;
//     }

//     try {
//       await createBoardColumn({
//         boardId,
//         status: formData.status,
//         title: formData.title,
//         position: maxPosition + 1,
//       });

//       setFormData(initialFormData);
//     } catch (e) {
//       alert("Ошибка");
//     }
//   };

//   const handleDragOver = (
//     e: React.DragEvent<HTMLDivElement>,
//     column: BoardColumn
//   ) => {
//     if (pending) {
//       e.preventDefault();
//       return;
//     }
//     if (!draggedItem || draggedItem.id === column.id) return;
//   };

//   const handleDrop = async (
//     e: React.DragEvent<HTMLDivElement>,
//     targetColumn: BoardColumn
//   ) => {
//     if (pending) {
//       e.preventDefault();
//       return;
//     }

//     e.preventDefault();
//     (e.target as HTMLElement).style.opacity = "1";

//     if (!draggedItem || draggedItem.id === targetColumn.id) {
//       setDraggedItem(null);
//       return;
//     }

//     setPending(true);
//     setDraggedItem(null);

//     try {
//       Promise.all([
//         moveBoardColumnPosition({
//           columnId: draggedItem.id,
//           newPosition: targetColumn.position,
//         }),
//         moveBoardColumnPosition({
//           columnId: targetColumn.id,
//           newPosition: draggedItem.position,
//         }),
//       ]);
//     } catch (error) {
//       console.error("Error updating positions:", error);
//       alert("Не удалось обновить позиции");
//     } finally {
//       setPending(false);
//     }
//   };

//   const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
//     (e.target as HTMLElement).style.opacity = "1";
//     setDraggedItem(null);
//   };

//   return (
//     <div>
//       <Input
//         placeholder="Введите название этапа"
//         value={formData.title}
//         onChange={(e) => onChangeTitle(e.target.value)}
//       />

//       <Button onClick={onCreateColumn} disabled={pending}>
//         Добавить столбец
//       </Button>

//       <div className="space-y-2 mt-4">
//         {sortedColumns.map((column) => (
//           <div
//             key={column.id}
//             draggable={!pending}
//             onDragStart={(e) => handleDragStart(e, column)}
//             onDragOver={(e) => handleDragOver(e, column)}
//             onDrop={(e) => handleDrop(e, column)}
//             onDragEnd={handleDragEnd}
//             className={`p-4 border rounded-lg flex justify-between items-center ${
//               draggedItem?.id === column.id ? "opacity-50" : ""
//             } ${pending ? "cursor-wait" : "cursor-move"}`}
//             ref={(el) => {
//               if (el) {
//                 columnsRef.current[column.position] = el;
//               }
//             }}
//           >
//             <span>{column.title}</span>
//             <Button
//               variant="destructive"
//               disabled={pending}
//               onClick={() => onDelete(column.id)}
//             >
//               Удалить
//             </Button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

"use client";
import { useState, useRef } from "react";
import {
  BoardColumnData,
  createBoardColumn,
  deleteBoardColumn,
  moveBoardColumnPosition,
} from "../(actions)";
import { BoardColumn } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ColumnData = Omit<BoardColumnData, "boardId" | "position">;
const initialFormData: ColumnData = {
  status: "",
  title: "",
};

export const UpdateBoardColumnsForm = ({
  boardId,
  columns: initialColumns,
}: {
  boardId: BoardColumn["boardId"];
  columns: BoardColumn[];
}) => {
  const [formData, setFormData] = useState<ColumnData>(initialFormData);
  const [draggedItem, setDraggedItem] = useState<BoardColumn | null>(null);
  const [pending, setPending] = useState(false);
  const columnsRef = useRef<HTMLDivElement[]>([]);

  const sortedColumns = [...initialColumns].sort(
    (a, b) => a.position - b.position
  );
  const maxPosition = sortedColumns[sortedColumns.length - 1]?.position || 0;

  const onDelete = async (id: string) => {
    try {
      await deleteBoardColumn(id);
    } catch (e) {
      alert("Ошибка");
    }
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    column: BoardColumn
  ) => {
    if (pending) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("text/plain", column.id);
    setDraggedItem(column);
    (e.target as HTMLElement).style.opacity = "0.4";
  };

  const onChangeTitle = (title: string) => {
    setFormData((p) => ({ ...p, title, status: title }));
  };

  const onCreateColumn = async () => {
    if (!formData.title) {
      alert("Заполните поле");
      return;
    }

    try {
      const newColumn = await createBoardColumn({
        boardId,
        status: formData.status,
        title: formData.title,
        position: maxPosition + 1,
      });
      setFormData(initialFormData);
    } catch (e) {
      alert("Ошибка");
    }
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    column: BoardColumn
  ) => {
    if (pending) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    if (!draggedItem || draggedItem.id === column.id) return;
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    targetColumn: BoardColumn
  ) => {
    if (pending) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    (e.target as HTMLElement).style.opacity = "1";

    if (!draggedItem || draggedItem.id === targetColumn.id) {
      setDraggedItem(null);
      return;
    }

    setPending(true);

    try {
      // Создаем новый массив с обновленными позициями
      const newColumns = initialColumns.map((col) => {
        if (col.id === draggedItem.id) {
          return { ...col, position: targetColumn.position };
        }
        if (col.id === targetColumn.id) {
          return { ...col, position: draggedItem.position };
        }
        return col;
      });

      await Promise.all([
        moveBoardColumnPosition({
          columnId: draggedItem.id,
          newPosition: targetColumn.position,
        }),
        moveBoardColumnPosition({
          columnId: targetColumn.id,
          newPosition: draggedItem.position,
        }),
      ]);
    } catch (error) {
      console.error("Error updating positions:", error);
      // В случае ошибки возвращаем предыдущее состояние
      alert("Не удалось обновить позиции");
    } finally {
      setPending(false);
      setDraggedItem(null);
    }
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    (e.target as HTMLElement).style.opacity = "1";
    setDraggedItem(null);
  };

  return (
    <div>
      <Input
        placeholder="Введите название этапа"
        value={formData.title}
        onChange={(e) => onChangeTitle(e.target.value)}
      />

      <Button onClick={onCreateColumn} disabled={pending}>
        Добавить столбец
      </Button>

      <div className={`space-y-2 mt-4 ${pending && "pointer-events-none"}`}>
        {sortedColumns.map((column) => (
          <div
            key={column.id}
            draggable={!pending}
            onDragStart={(e) => handleDragStart(e, column)}
            onDragOver={(e) => handleDragOver(e, column)}
            onDrop={(e) => handleDrop(e, column)}
            onDragEnd={handleDragEnd}
            className={`p-4 border rounded-lg flex justify-between items-center ${
              draggedItem?.id === column.id ? "opacity-50" : ""
            }`}
            ref={(el) => {
              if (el) {
                columnsRef.current[column.position] = el;
              }
            }}
          >
            <span>{column.title}</span>
            <Button
              variant="destructive"
              onClick={() => onDelete(column.id)}
              disabled={pending}
            >
              Удалить
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
