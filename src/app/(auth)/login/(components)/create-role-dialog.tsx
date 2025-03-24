import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { roleLocalization, rolesList } from "@/constants/roles-lozalization";
import { RoleType } from "@prisma/client";

import { Label } from "@radix-ui/react-label";
import { ChangeEvent } from "react";

export const CreateRoleDialog = ({
  onChangeName,
  onChangeType,
  onCreate,
  name,
  type,
}: {
  name: string;
  type: RoleType | undefined;
  onCreate: () => void;
  onChangeName: (value: ChangeEvent<HTMLInputElement>) => void;
  onChangeType: (value: RoleType) => void;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full p-2 rounded mb-2">
          Хотите создать новую роль ?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Создать новую роль</DialogTitle>
          <DialogDescription>
            Диалоговое окно для создание новой роли
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Имя роли
            </Label>
            <Input
              id="name"
              placeholder="Имя вашей новой роли"
              className="col-span-3"
              value={name}
              onChange={onChangeName}
            />
          </div>
        </div>
        {type && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roleType" className="text-right">
                Текущий тип роли
              </Label>
              <b>{type}</b>
            </div>
          </div>
        )}

        <div>
          <h2>
            <b>Возможные роли:</b>
          </h2>
          {rolesList.map((role) => (
            <div
              key={role}
              className="cursor-pointer"
              onClick={() => onChangeType(role)}
            >
              {roleLocalization[role]}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onCreate} type="submit">
            Создать роль
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
