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
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { updateBoardTitle } from "../(actions)";

interface UpdateBoardTitleDialogProps {
  boardId: string;
  currentTitle: string;
}

export const UpdateBoardTitleDialog = ({
  boardId,
  currentTitle,
}: UpdateBoardTitleDialogProps) => {
  const [title, setTitle] = useState(currentTitle);

  const handleSubmit = async () => {
    try {
      await updateBoardTitle(boardId, title);
      alert("Название доски обновлено");
    } catch (error) {
      alert("Ошибка при обновлении названия");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-4">
          Изменить название
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Изменить название доски</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Новое название доски"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Сохранить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
