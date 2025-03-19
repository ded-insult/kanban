import { login } from "@/lib/auth2";
import { User } from "@prisma/client";

export const LoginForm = ({ user }: { user?: User }) => {
  //   const [isPending, startTransition] = useTransition(); // Для обработки асинхронных операций

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

        {/* <div className="mb-4">
        <label htmlFor="role" className="block mb-2">
          Role
        </label>
        <Select onValueChange={setRoleId} disabled={isPending}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выбрать роль" />
          </SelectTrigger>
          <SelectContent>
            {roles?.map((role) => (
              <SelectItem value={role.id.toString()} key={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}

        {/* {error && <p className="text-red-500 mb-4">{error}</p>} */}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          // disabled={isPending}
        >
          {/* {isPending ? "Обработка..." : isLogin ? "Login" : "Register"} */}
          Войти
        </button>
      </form>
    </div>
  );
};
