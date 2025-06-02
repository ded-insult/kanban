import { Subtask, Task } from "@prisma/client";
import { useState } from "react";

export const useSubtasksCreate = () => {
  const [subtaskTitle, setSubtaskTitle] = useState("");
  const [subtasks, setSubtasks] = useState<string[]>([]);

  const handleAddSubtask = () => {
    if (subtaskTitle.trim()) {
      setSubtasks((prev) => [...prev, subtaskTitle.trim()]);
      setSubtaskTitle("");
    }
  };

  const handleSubtaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubtaskTitle(e.target.value);
  };

  const handleDeleteSubtask = (id: number) => () => {
    setSubtasks((prev) => prev.filter((_, index) => index !== id));
  };

  return {
    title: subtaskTitle,
    data: subtasks,
    handleAddSubtask,
    handleDeleteSubtask,
    handleSubtaskChange,
    empty: () => setSubtasks([]),
  };
};
