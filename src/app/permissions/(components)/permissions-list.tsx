import { User } from "@prisma/client";
import {
  getBoarsdWithUsers,
  getUserBoardsWithPermissions,
  getUserWithRolesAndBoards,
} from "../(actions)";
import { Card } from "@/components/ui/card";

export const PermissionsList = async ({ user }: { user?: User }) => {
  // const permissions = await getLocalPermissions(user?.id ?? "");
  const boardList = await getBoarsdWithUsers(user?.id || "");
  const data = await getUserWithRolesAndBoards(user?.id ?? "");
  const userData = await getUserBoardsWithPermissions(user?.id ?? "");

  return (
    <div className="space-y-6">
      <Card.Wrapper>
        <Card.Header>
          <Card.Title className="text-xl">Ваши права доступа</Card.Title>
        </Card.Header>
        <Card.Content className="space-y-6">
          {/* Основная информация */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Никнейм: {data!.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Ваша роль:{" "}
                  <span className="font-medium">{data!.role.name}</span>
                </p>
              </div>

              {data!.boards.length === 0 && data!.ownedBoards.length === 0 ? (
                <span className="text-xs bg-red-100 dark:bg-blue-900 text-red-800 dark:text-red-200 px-3 py-1 rounded-full">
                  Не участвует в досках
                </span>
              ) : (
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                  Участвует в досках
                </span>
              )}
            </div>
          </div>

          {/* Доски, где пользователь владелец */}
          {data!.ownedBoards.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Доски, которыми вы владеете</h3>
              <div className="space-y-3">
                {data!.ownedBoards.map((board) => (
                  <div
                    key={board.id}
                    className="p-4 border dark:border-gray-700 rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{board.title}</h4>
                      <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                        Владелец
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Полный доступ ко всем функциям
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Доски, где пользователь участник */}
          {data!.boards.length > 0 && (
            <div>
              <div className="space-y-6">
                {/* Доски владельца */}
                {userData!.ownedBoards.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Мои доски</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {userData!.ownedBoards.map((board) => (
                        <div
                          key={board.id}
                          className="border rounded-lg p-4 shadow-sm"
                        >
                          <h3 className="font-medium">{board.title}</h3>
                          <p className="text-sm text-green-600 mb-2">
                            Вы владелец
                          </p>
                          <div className="mt-3">
                            <p className="text-sm text-gray-500">
                              Доступные права:
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {/* {board.permissions.map((permission) => (
                                <span
                                  key={permission.name}
                                  className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
                                >
                                  {permission.name}
                                </span>
                              ))} */}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Доски участника */}
                {userData!.boards.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Доски с доступом</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {userData!.boards.map((board) => (
                        <div
                          key={board.id}
                          className="border rounded-lg p-4 shadow-sm"
                        >
                          <h3 className="font-medium">{board.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">
                            Владелец: {board.owner.name}
                          </p>
                          <div className="mt-3">
                            <p className="text-sm text-gray-500">Ваши права:</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {/* {board.permissions.length > 0 ? (
                                board.permissions.map((permission) => (
                                  <span
                                    key={permission.name}
                                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                                  >
                                    {permission.name}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                                  Доступов нет
                                </span>
                              )} */}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Глобальные права роли */}
                <div>
                  <h2 className="text-xl font-bold mb-4">
                    Права вашей роли ({userData!.role.name})
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {/* {userData!.role.permissions.map((permission) => (
                      <div
                        key={`${permission.board?.id}-${permission.name}`}
                        className="border rounded-lg p-3 text-sm"
                      >
                        <p className="font-medium">{permission.name}</p>
                        {permission.board && (
                          <p className="text-gray-500">
                            Доска: {permission.board.title}
                          </p>
                        )}
                      </div>
                    ))} */}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Сообщение, если нет досок */}
          {data!.boards.length === 0 && data!.ownedBoards.length === 0 && (
            <div className="text-center p-6 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Вы не участвуете ни в одной доске
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Создайте новую доску или попросите доступ у администратора
              </p>
            </div>
          )}
        </Card.Content>
      </Card.Wrapper>

      {/* {!permissions?.role.permissions.length && boardList.length > 0 && (
        <Card.Wrapper className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <Card.Header>
            <Card.Title className="text-xl text-yellow-800 dark:text-yellow-200">
              Доски, по которым вы можете запросить доступ
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <ul className="space-y-3">
              {boardList.map((board) => (
                <li
                  key={board.id}
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <span className="font-medium">{board.title}</span>
                </li>
              ))}
            </ul>
          </Card.Content>
        </Card.Wrapper>
      )} */}
    </div>
  );
};
