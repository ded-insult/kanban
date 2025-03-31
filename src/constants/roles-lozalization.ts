import { RoleType } from "@prisma/client";

export const rolesList: RoleType[] = [
  "ADMIN",
  "MANAGER",
  "DEVELOPER",
  "TEAM_LEAD",
  "TESTER",
] as const;

export const roleLocalization: Record<RoleType, string> = {
  ADMIN: "Администратор",
  MANAGER: "Менеджер",
  DEVELOPER: "Разработчик",
  TEAM_LEAD: "Руководитель разработки",
  TESTER: "Тестировщик",
} as const;
