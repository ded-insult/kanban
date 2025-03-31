import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { login } from "@/lib/auth2";
import { roles } from "../(constants)";

export const LoginForm = () => {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">логин</h2>
      <form action={login}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">
            Имя пользователя
          </label>
          <input
            className="w-full p-2 border rounded"
            //   disabled={isPending}
            type="text"
            name="name"
            placeholder="Имя"
            required
          />
        </div>

        {/* <label htmlFor="role">Роль</label>
        <Select name="role" required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выбрать роль" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.entries(roles).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <br /> */}

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
            //   disabled={isPending}
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
