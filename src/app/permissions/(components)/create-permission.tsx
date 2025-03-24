import { Board, Role, User } from "@prisma/client";
import { CreatePermissionDialog } from "./create-permission-dialog";

export const CreatePermission = ({
  isAdmin,
  boards,
  user,
  roles,
}: {
  isAdmin: boolean;
  boards: Board[];
  user: User;
  roles: Role[];
}) => {
  return (
    <div>
      <div>
        <b>Создать доступ:</b>

        {isAdmin && (
          <CreatePermissionDialog roles={roles} user={user} boards={boards} />
        )}
      </div>

      <div></div>
    </div>
  );
};
