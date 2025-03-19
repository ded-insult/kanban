import { RoleType } from "@prisma/client";

export const roleLocalization: Record<RoleType, string> = {
  ADMIN: "Администратор",
  MANAGER: "Менеджер",
  DEVELOPER: "Разработчик",
  TEAM_LEAD: "Руководитель разработки",
  TESTER: "Тестировщик",
  OTHER: "Другое",
};
