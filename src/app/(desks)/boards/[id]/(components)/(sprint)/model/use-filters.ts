"use client";
import { Sprint, Task } from "@prisma/client";
import { useState } from "react";

type NewSprint = Sprint & {
  backlog: Task[];
};

export const useFilters = (tasks: NewSprint) => {
  const [title, setTitle] = useState("");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const filteredTasks = tasks.backlog.filter((task) => {
    return task.title.toLowerCase().includes(title.toLowerCase());
  });

  return {
    title,
    handleTitleChange,
    filteredTasks,
  };
};
