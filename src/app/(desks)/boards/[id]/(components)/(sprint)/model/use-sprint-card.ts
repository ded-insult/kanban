"use client";
import { useState } from "react";
import { deleteSprint, startSprint } from "../../../(actions)";
import { toast } from "react-toastify";

export const useSprintCard = (boardId: string) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStartSprint = async (sprintId: string) => {
    try {
      const result = await startSprint(sprintId, boardId);

      if (!result.success) {
        toast.warn("Создайте хотя бы одну колонку для доски");
        return;
      }
    } catch (error) {
      console.error("Error starting sprint:", error);
      toast.warn("Создайте хотя бы одну колонку для доски");
    }
  };

  const handleDeleteSprint = async (sprintId: string) => {
    if (
      !confirm(
        "Вы уверены, что хотите удалить спринт? Все задачи будут удалены."
      )
    ) {
      return;
    }

    try {
      await deleteSprint(sprintId);
      //   const updatedSprints = await getSprint(id);
      //   setSprints(updatedSprints);
    } catch (error) {
      console.error("Error deleting sprint:", error);
      toast.error("Ошибка при удалении спринта");
    }
  };

  const handleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return { isExpanded, handleExpand, handleStartSprint, handleDeleteSprint };
};
