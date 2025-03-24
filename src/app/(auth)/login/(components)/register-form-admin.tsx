"use client";

import { Role, RoleType, User } from "@prisma/client";
import { createRoleByName, createUser } from "../(actions)";
import { useState } from "react";
import { CreateRoleDialog } from "./create-role-dialog";

export const RegisterFormByAdmin = ({ roles }: { roles: Role[] }) => {
  // Dialog
  const [roleName, setRoleName] = useState<Role["name"]>("");
  const [roleType, setRoleType] = useState<RoleType>();

  // Current
  const [user, setUser] = useState<Pick<User, "name" | "password" | "roleId">>({
    name: "",
    password: "",
    roleId: "",
  });

  const onCreateRole = async () => {
    try {
      await createRoleByName(roleName);
      alert("Роль успешно создана!");
      setRoleName("");
    } catch (error) {
      alert("Ошибка при создании роли");
    }
  };

  const onCreateUser = async () => {
    if (!("name" in user!) || !("password" in user!) || !("roleId" in user!)) {
      alert("Все поля должны быть заполнены");
      return;
    }

    try {
      await createUser({
        name: user.name,
        password: user.password,
        roleId: user.roleId,
      });
      alert("Пользователь успешно создана!");
      setRoleName("");
    } catch (error) {
      alert("Ошибка при создании пользователя");
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
        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2">
              Имя пользователя
            </label>
            <input
              className="w-full p-2 border rounded"
              type="text"
              name="name"
              placeholder="Имя"
              required
              value={user?.name}
              onChange={(e) =>
                setUser((p) => ({ ...p, name: e.target.value } as User))
              }
            />
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
              value={user?.password}
              onChange={(e) =>
                setUser((p) => ({ ...p, password: e.target.value } as User))
              }
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block mb-2">
              Role
            </label>

            {roles.map((role) => (
              <li
                key={role.id}
                className="cursor-pointer"
                onClick={() =>
                  setUser((p) => ({ ...p, roleId: role.id } as User))
                }
              >
                {role.id === user?.roleId ? <b>{role.name}</b> : role.name}
              </li>
            ))}
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
            onClick={onCreateUser}
          >
            Регистрация пользователя
          </button>
        </form>
      </div>
    </>
  );
};
