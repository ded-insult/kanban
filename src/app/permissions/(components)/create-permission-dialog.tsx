"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LabelUI } from "@/components/ui/label";
import { CreateBoardDialog } from "./create-board-dialog";
import { useState } from "react";
import { createPermission } from "../(actions)";
import { Board, Permission, Role, User } from "@prisma/client";

interface CreatePermission {
  name: Permission["name"];
  boardId: Permission["boardId"];
  roleId: User["roleId"];
}

const initialFormState: CreatePermission = {
  boardId: "",
  name: "",
  roleId: "",
};

export const CreatePermissionDialog = ({
  boards,
  user,
  roles,
}: {
  user: User;
  boards: Board[];
  roles: Role[];
}) => {
  const [formData, setFormData] = useState<CreatePermission>(initialFormState);
  const onClickBoard = (boardId: Permission["boardId"]) => {
    setFormData((p) => ({ ...p, boardId }));
  };

  const onChangeName = (name: Permission["name"]) => {
    setFormData((p) => ({ ...p, name }));
  };

  const onChangeRole = (roleId: User["roleId"]) => {
    setFormData((p) => ({ ...p, roleId }));
  };

  const onCreatePermission = async () => {
    if (!formData.boardId || !formData.name || !formData.roleId) {
      alert("Заполните поля");
      return;
    }

    try {
      // await createPermission({
      //   name: formData.name,
      //   boardId: formData.boardId,
      //   roleId: formData.roleId,
      // });
      alert("Успех");
    } catch (e) {
      alert(
        "произошла ошибка, попробуйте снова и проверьте корректность данных"
      );
    }
    return;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Создать доступ</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Создать доступ</DialogTitle>
          <DialogDescription>
            Окно для создания нового разрешения
          </DialogDescription>
        </DialogHeader>

        <BoardList
          selectedBoard={formData.boardId}
          onClick={onClickBoard}
          boards={boards}
        />

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <LabelUI htmlFor="name" className="text-right">
              Имя доступа
            </LabelUI>
            <Input
              id="name"
              placeholder="Введите название"
              className="col-span-3"
              value={formData.name}
              onChange={(e) => onChangeName(e.target.value)}
            />
            <div>
              <LabelUI htmlFor="board" className="text-right">
                Выбранная роль
              </LabelUI>
            </div>

            <div>
              {roles.map((role) => (
                <div key={role.id} onClick={() => onChangeRole(role.id)}>
                  {role.name}
                </div>
              ))}
            </div>
          </div>

          <CreateBoardDialog user={user!} />
        </div>

        <DialogFooter>
          <Button type="submit" onClick={onCreatePermission}>
            Создать доступ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const BoardList = ({
  boards,
  onClick,
  selectedBoard,
}: {
  boards: Board[];
  onClick: (value: string) => void;
  selectedBoard: Board["id"];
}) => {
  return (
    <div>
      <h3>Созданные вами доски:</h3>
      {boards.map((board) => (
        <div
          className="cursor-pointer"
          key={board.id}
          onClick={() => onClick(board.id)}
        >
          {selectedBoard === board.id ? (
            <strong>{board.title}</strong>
          ) : (
            board.title
          )}
        </div>
      ))}
    </div>
  );
};
