import { Button } from "@/components/ui/button";
import { LinkUI } from "@/components/ui/link";
import { routes } from "@/constants/routes";
import { checkAdminV2 } from "@/lib/check-admin";
import { Role, User } from "@prisma/client";

export const BoardsHeader = ({ user }: { user: User & { role: Role } }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900">Проектные доски</h1>
      {checkAdminV2(user) && (
        <Button className="bg-blue-600 hover:bg-blue-700 transition-colors">
          <LinkUI theme="light" href={routes.boards.create}>
            Создать доску
          </LinkUI>
        </Button>
      )}
    </div>
  );
};
