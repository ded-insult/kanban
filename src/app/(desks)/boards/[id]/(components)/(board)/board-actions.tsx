import { Button } from "@/components/ui/button";
import { LinkUI } from "@/components/ui/link";
import { routes } from "@/shared/constants/routes";
import { can } from "@/shared/lib/permissions";
import { User } from "../../page";
import { endSprint } from "@/app/(desks)/(actions)/sprint-actions";

export const BoardActions = ({
  user,
  boardId,
}: {
  user: User;
  boardId: string;
}) => {
  const handleEndSprint = async () => {
    try {
      // setIsEndingSprint(true);
      await endSprint(boardId);
      // await NEED_TO_RENAME_FN(id).then(setBoardData);
      alert("Спринт успешно завершен");
    } catch (error) {
      console.error("Error ending sprint:", error);
      alert("Ошибка при завершении спринта");
    } finally {
      // setIsEndingSprint(false);
    }
  };

  return (
    <div>
      {can(user!.role.role, "board", "update") && (
        <LinkUI
          className="mr-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 hover:bg-blue-700 h-9 px-4 py-2 text-white hover:text-white"
          href={routes.boards.update.replace(":id", boardId)}
        >
          Обновить доску
        </LinkUI>
      )}

      {can(user!.role.role, "sprint", "update") && (
        <Button
          variant="default"
          className=""
          onClick={handleEndSprint}
          // disabled={isEndingSpring}
        >
          Закончить спринт
          {/* {isEndingSpring ? "Завершение..." : "Закончить спринт"} */}
        </Button>
      )}
    </div>
  );
};
