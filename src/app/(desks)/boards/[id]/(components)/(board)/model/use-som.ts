import { Subtask } from "@prisma/client";
import { useState } from "react";

export const useSome = (initialSubtasks: Subtask[]) => {
  const [subtasks, setSubtasks] = useState(initialSubtasks);

  const handleDelete = (id: string) => {
    setSubtasks((prev) => prev.filter((subtask) => subtask.id !== id));
  };

  const handleAdd = () => {
    setSubtasks((prev) => [
      ...prev,
      // title: string;
      // description: string | null;
      // parentTaskId: string;
      // assigneeId: string | null;
      // completed: boolean;
      // columnId: string;
    ]);
  };

  return {};
};
