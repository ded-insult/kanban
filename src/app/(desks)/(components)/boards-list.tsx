import { LinkUI } from "@/components/ui/link";
import { routes } from "@/constants/routes";
import { prisma } from "@/lib/prisma";

export const BoardsList = async () => {
  const boards = await prisma.board.findMany();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boards?.map((board) => (
          <LinkUI
            key={board.id}
            href={routes.boards.id.replace(":id", board.id)}
            className="w-[30%] min-w-[300px] transform transition-all duration-300 hover:scale-105"
          >
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:border-blue-500 hover:shadow-xl h-full">
              <div className="flex items-center justify-between">
                <h5 className="text-xl flex-shrink-1 font-semibold text-gray-900 truncate w-[200px] max-w-[200px]">
                  {board.title}
                </h5>
                <div className="bg-blue-100 rounded-full p-2 flex-shrink-0 ml-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </LinkUI>
        ))}

        {boards.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">Нет доступных досок</p>
          </div>
        )}
      </div>
    </div>
  );
};
