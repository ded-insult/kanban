"use client";
import { Input } from "@/components/ui/input";
import { loginV2 } from "@/shared/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const userSchema = z.object({
  username: z.string({
    required_error: "Имя пользователя обязательно",
    invalid_type_error: "Введите корректное имя пользователя",
  }),
  password: z.string({
    required_error: "Пароль обязателен",
  }),
});

type UserData = z.infer<typeof userSchema>;

export const FormLogin = () => {
  const form = useForm({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: UserData) => {
    try {
      await loginV2({ password: data.password, username: data.username });
      toast.success("Успешно", { autoClose: 1750 });
    } catch (e) {
      toast.error("Произошла ошибка", { autoClose: 1750 });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">логин</h2>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2">
            Имя пользователя
          </label>
          <Input
            {...form.register("username")}
            className="w-full p-2 border rounded"
            error={form.formState.errors.username}
            type="text"
            name="username"
            placeholder="Имя"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">
            Password
          </label>
          <Input
            {...form.register("password")}
            error={form.formState.errors.password}
            className="w-full p-2 border rounded"
            type="password"
            name="password"
            placeholder="Пароль"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Войти
        </button>
      </form>
    </div>
  );
};
