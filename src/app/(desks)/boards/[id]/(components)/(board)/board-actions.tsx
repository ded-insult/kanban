import { Button } from "@/components/ui/button";
import { LinkUI } from "@/components/ui/link";
import { routes } from "@/shared/constants/routes";
import { endSprint } from "@/app/(desks)/(actions)/sprint-actions";
import { toast } from "react-toastify";

export const BoardActions = ({
  boardId,
  canUpdateBoard,
  canUpdateSprint,
}: {
  canUpdateBoard: boolean;
  canUpdateSprint: boolean;
  boardId: string;
}) => {
  const handleEndSprint = async () => {
    try {
      await endSprint(boardId);
      toast.success("Спринт успешно завершен");
    } catch (error) {
      console.error("Error ending sprint:", error);
      toast.error("Ошибка при завершении спринта");
    }
  };

  return (
    <div>
      {canUpdateBoard && (
        <LinkUI
          className="mr-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 hover:bg-blue-700 h-9 px-4 py-2 text-white hover:text-white"
          href={routes.boards.update.replace(":id", boardId)}
        >
          Обновить доску
        </LinkUI>
      )}

      {canUpdateSprint && (
        <Button variant="default" className="" onClick={handleEndSprint}>
          Закончить спринт
        </Button>
      )}
    </div>
  );
};
