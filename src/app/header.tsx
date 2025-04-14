import { Button } from "@/components/ui/button";
import { LinkUI } from "@/components/ui/link";
import { routes } from "@/constants/routes";
import { getCurrentUser, logout } from "@/lib/auth2";

export const Header = async () => {
  const user = await getCurrentUser();

  return (
    <header className="bg-blue-500 text-white p-4 h-[60px] flex items-center justify-between w-full">
      <h1 className="text-2xl font-bold">
        <LinkUI
          theme="light"
          // className="text-white-900 hover:text-gray-400"
          href={routes.home}
        >
          Мониторинг процессов
        </LinkUI>
      </h1>

      <div>
        {user?.name}

        {user && (
          <Button onClick={logout} className="justify-end">
            Выйти
          </Button>
        )}

        {!user && (
          <LinkUI href={routes.login}>
            <Button className="justify-end">Войти</Button>
          </LinkUI>
        )}
      </div>
    </header>
  );
};
