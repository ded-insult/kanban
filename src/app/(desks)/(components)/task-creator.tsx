"use client";
import { useEffect, useState } from "react";
import { getTaskCreator } from "../(actions)";

type Creator = Awaited<ReturnType<typeof getTaskCreator>>;

export const TaskCreator = ({ creatorId }: { creatorId: string }) => {
  const [user, setUser] = useState<Creator>();

  useEffect(() => {
    getTaskCreator(creatorId).then((res) => {
      setUser(res);
    });
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500">Создатель: </span>
      <span className="text-gray-500">{user?.name}</span>
    </div>
  );
};
