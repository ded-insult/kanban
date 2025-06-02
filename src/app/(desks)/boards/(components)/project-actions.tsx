import { Button } from "@/components/ui/button";
import { LinkUI } from "@/components/ui/link";
import { routes } from "@/shared/constants/routes";

export const ProjectActions = ({
  canCreateBoard,
}: {
  canCreateBoard: boolean;
}) => {
  return (
    <>
      {canCreateBoard && (
        <Button className="bg-blue-600 hover:bg-blue-700 transition-colors">
          <LinkUI theme="light" href={routes.boards.create}>
            Создать доску
          </LinkUI>
        </Button>
      )}
    </>
  );
};
