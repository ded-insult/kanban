import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LabelUI } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Board, User } from "@prisma/client";
import { useState } from "react";
import { createBoard } from "../(actions)";

export const CreateBoardDialog = ({
  boards,
  user,
}: {
  boards: Board[];
  user: User;
}) => {
  const [boardTitle, setBoardTitle] = useState("");

  const onCreateBoard = async () => {
    try {
      if (!boardTitle) {
        alert("Нужно заполнить поле!");
        return;
      }
      await createBoard({
        ownerId: user.id,
        title: boardTitle,
      });

      alert("Успех");
    } catch (e) {
      alert("Ошибка");
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="col-span-4">
          Создать доску
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Создать доску</DialogTitle>
          <DialogDescription>Окно для создания доски </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <LabelUI htmlFor="nested-field" className="text-right">
              Имя доски
            </LabelUI>
            <Input
              required
              id="nested-field"
              onChange={(e) => setBoardTitle(e.target.value)}
              value={boardTitle}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onCreateBoard}>
            Подтвердить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
