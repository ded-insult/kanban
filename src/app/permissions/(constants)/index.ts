import { RoleType } from "@prisma/client";

export const translations = {
  roles: {
    ADMIN: "Администратор",
    TEAM_LEAD: "Тимлид",
    DEVELOPER: "Разработчик",
    TESTER: "Тестировщик",
    MANAGER: "Менеджер",
  },
  entities: {
    board: "Доска",
    column: "Колонка",
    task: "Задача",
    subtask: "Подзадача",
    sprint: "Спринт",
    // section: "Секция",
    user: "Пользователь",
  },
  actions: {
    create: "Создание",
    update: "Изменение",
    delete: "Удаление",
  },
  title: "Обзор прав доступа",
  tableHeaders: {
    entity: "Сущность",
    action: "Действие",
  },
};

export const entities = [
  "board",
  "column",
  "task",
  "subtask",
  "sprint",
  // "section",
  "user",
];
export const actions = ["create", "update", "delete"];
export const roles: RoleType[] = [
  "ADMIN",
  "TEAM_LEAD",
  "DEVELOPER",
  "TESTER",
  "MANAGER",
];
