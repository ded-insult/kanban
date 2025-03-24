import { RoleType } from "@prisma/client";

export const rolesList: RoleType[] = [
  "ADMIN",
  "MANAGER",
  "DEVELOPER",
  "TEAM_LEAD",
  "TESTER",
  "OTHER",
] as const;

export const roleLocalization: Record<RoleType, string> = {
  ADMIN: "Администратор",
  MANAGER: "Менеджер",
  DEVELOPER: "Разработчик",
  TEAM_LEAD: "Руководитель разработки",
  TESTER: "Тестировщик",
  OTHER: "Другое",
} as const;
