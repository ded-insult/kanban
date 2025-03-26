import { LinkUI } from "@/components/ui/link";
import { routes } from "@/constants/routes";
import { prisma } from "@/lib/prisma";

export const BoardsList = async () => {
  const boards = await prisma.board.findMany();

  return (
    <div>
      {boards?.map((board) => (
        <div key={board.id} className="p-4 pl-0">
          <LinkUI
            href={routes.boards.id.replace(":id", board.id)}
            className="block p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {board.title}
            </h5>
          </LinkUI>
        </div>
      ))}
    </div>
  );
};
