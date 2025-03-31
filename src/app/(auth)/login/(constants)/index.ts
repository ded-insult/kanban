import { RoleType } from "@prisma/client";

type RoleLocalize = {
  value: string;
  name: string;
};
type Roles = Record<RoleType, RoleLocalize>;

export const roles: Roles = {
  ADMIN: {
    value: "ADMIN",
    name: "Администратор",
  },
  DEVELOPER: {
    value: "DEVELOPER",
    name: "Разработчик",
  },
  MANAGER: {
    value: "MANAGER",
    name: "Менеджер",
  },
  TEAM_LEAD: {
    value: "TEAM_LEAD",
    name: "Руководитель команды",
  },
  TESTER: {
    value: "TESTER",
    name: "Тестировщик",
  },
};
