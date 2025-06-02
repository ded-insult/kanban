"use client";

import { Role } from "@prisma/client";
import { registerUserV2 } from "../(actions)";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormCreateRoleDialog } from "./form-create-role-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Label } from "@radix-ui/react-label";

const RegisterSchema = z.object({
  username: z.string().min(3, "Имя пользователя обязательно"),
  password: z.string().min(3, "Пароль обязателен"),
  role: z.string().min(1, "Роль обязательна"),
});
type RegisterFormData = z.infer<typeof RegisterSchema>;

export const FormCreateUser = ({ roles }: { roles: Role[] }) => {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { username: "", password: "", role: "" },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUserV2({
        password: data.password,
        roleId: data.role,
        username: data.username,
      });
      toast.success("Успех, вы создали пользователя", { autoClose: 1750 });
      form.reset();
    } catch (err) {
      toast.error("Возможно, пользователь уже существует", {
        autoClose: 1750,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
        Поскольку вы являетесь администратором, то можете создавать
        пользователей
      </h2>
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-medium text-gray-900 mb-6 text-center">
          Регистрация пользователя
        </h2>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="username"
              className="text-sm font-medium text-gray-700 block"
            >
              Имя пользователя
            </Label>
            <Input
              {...form.register("username")}
              error={form.formState.errors.username}
              type="text"
              name="username"
              placeholder="Имя"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="role"
              className="text-sm font-medium text-gray-700 block"
            >
              Роль
            </Label>
            <Controller
              control={form.control}
              name="role"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  name="role"
                  required
                >
                  <SelectTrigger
                    error={form.formState.errors.role}
                    className="w-full"
                  >
                    <SelectValue placeholder="Выбрать роль" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {roles.map((role) => (
                        <SelectItem
                          value={role.id}
                          key={role.id}
                          className="cursor-pointer hover:bg-gray-100"
                        >
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.role && (
              <p className="text-red-500 text-xs mt-1">
                {form.formState.errors.role.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 block"
            >
              Пароль
            </Label>
            <Input
              {...form.register("password")}
              error={form.formState.errors.password}
              type="password"
              name="password"
              placeholder="Пароль"
              className="w-full"
            />
          </div>

          <div className="pt-2">
            <FormCreateRoleDialog />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Регистрация пользователя
          </Button>
        </form>
      </div>
    </div>
  );
};
