"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { addUserToBoard, getAllUsers } from "../../(actions)";
import { toast } from "react-toastify";

interface Props {
  boardId: string;
  onUserAdded?: () => void;
}

export const BoardAddUsersDialog = ({ boardId, onUserAdded }: Props) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    getAllUsers()
      .then((users) => {
        setUsers(users);
      })
      .catch(() => {
        toast.error("Ошибка, попробуйте обновить страницу");
      });
  }, []);

  const handleAddUser = async (userId: string) => {
    try {
      setLoading(true);
      await addUserToBoard(boardId, userId);
      onUserAdded?.();
    } catch (error) {
      console.error("Error adding user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Добавить исполнителей
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-scroll max-h-[500px]">
        <DialogHeader>
          <DialogTitle>Добавить исполнителей к доске</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-2 border rounded"
            >
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.role.name}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddUser(user.id)}
                disabled={loading}
              >
                Добавить
              </Button>
            </div>
          ))}
        </div>
        <DialogFooter>
          <DialogTrigger>Закрыть</DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
