import { moveTaskToColumn } from "@/app/(desks)/(actions)";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

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

export const useDragColumnCard = () => {
  const [dragState, setDragState] = useState<DragState>(initilDragState);

  const router = useRouter();
  const onDragStart = (_: React.DragEvent<HTMLDivElement>, taskId: string) => {
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

      router.refresh();
      // alert("Успех");
    } catch (e) {
      toast.error("Ошибка");
    }
  };

  return { dragState, onDragStart, onDragEnter, onDragEnd };
};
