"use client";

import { roleLocalization } from "@/constants/roles-lozalization";
import { Role } from "@prisma/client";
import { useState } from "react";
import { createRole2 } from "./create-role";

const defaultRoles = Object.values(roleLocalization);

export const RegisterFormByAdmin = ({ roles }: { roles: Role[] }) => {
  const [selectedRole, setRole] = useState<Role>();
  const [isOpen, setIsOpen] = useState(false);
  const [addedRole, setAddedRole] = useState("");

  const handleCreateRole = async (name: string) => {
    try {
      await createRole2(name);
      alert("Роль успешно создана!");
      setAddedRole("");
    } catch (error) {
      alert("Ошибка при создании роли");
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
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block mb-2">
              Role
            </label>

            {roles?.map((role) => (
              <li onClick={() => setRole(role)} key={role.id}>
                {role.name}
              </li>
            ))}
          </div>

          <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
            Открыть список ролей
          </div>

          {isOpen && roles.map((role) => <div key={role.id}>{role.name}</div>)}
          {isOpen && <strong>Добавить роль</strong>}
          {defaultRoles.map((role) => (
            <p key={role} onClick={() => setAddedRole(role)}>
              {role}
            </p>
          ))}

          {addedRole && (
            <div onClick={() => handleCreateRole(addedRole)}>
              Создать роль : {addedRole}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            Reg
          </button>
        </form>
      </div>
    </>
  );
};
