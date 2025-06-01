"use client";

import { Role, RoleType } from "@prisma/client";
import { createRoleByName, registerUser } from "../(actions)";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateRoleDialog } from "./create-role-dialog";

export const RegisterFormByAdmin = ({ roles }: { roles: Role[] }) => {
  const [roleName, setRoleName] = useState<Role["name"]>("");
  const [roleType, setRoleType] = useState<RoleType>("MANAGER");

  const onCreateRole = async () => {
    try {
      if (!roleName || !roleType) {
        alert("Заполните все поля");
        return;
      }
      await createRoleByName(roleName, roleType);
      alert("Роль успешно создана!");
      setRoleName("");
    } catch (error) {
      alert("Ошибка при создании роли");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let formData = new FormData(event.currentTarget);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    try {
      console.log(formData);

      await registerUser(formData);
      alert("Успех, вы создали пользователя");
    } catch (err) {
      alert("Произошла ошибка");
      event.currentTarget.reset();
    }
  };

  return (
    <>
      <h2>
        Поскольку вы являетесь администратором, то можете создавать
        пользователей
      </h2>

      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2>Регистрация пользователя</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2">
              Имя пользователя
            </label>
            <input
              className="w-full p-2 border rounded"
              type="text"
              name="username"
              placeholder="Имя"
              required
            />
          </div>
          <div>
            <label htmlFor="role">Роль</label>
            <Select name="role" required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выбрать роль" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {roles.map((role) => (
                    <SelectItem
                      value={role.id}
                      key={role.id}
                      className="cursor-pointer"
                    >
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <br />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2">
              Password
            </label>
            <input
              className="w-full p-2 border rounded"
              type="password"
              name="password"
              placeholder="Пароль"
              required
            />
          </div>

          <CreateRoleDialog
            onCreate={onCreateRole}
            onChangeName={(e) => setRoleName(e.target.value)}
            onChangeType={setRoleType}
            name={roleName}
            type={roleType}
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            Регистрация пользователя
          </button>
        </form>
      </div>
    </>
  );
};
