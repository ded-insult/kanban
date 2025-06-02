import { Subtask } from "@prisma/client";
import { ChangeEvent, useState } from "react";

export const useSubtasksUpdate = (subtasks: Subtask[]) => {
  const [data, setData] = useState<Subtask[]>(subtasks);

  const updateSubtask =
    (id: string, field: "completed" | "title") =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = field === "completed" ? e.target.checked : e.target.value;

      setData((prev) =>
        prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
      );
    };

  const deleteSubtask = (id: string) => {
    setData((prev) => prev.filter((s) => s.id !== id));
  };

  return {
    data,
    empty: () => setData([]),
    updateSubtask,
    deleteSubtask,
  };
};
