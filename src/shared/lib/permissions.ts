import { RoleType } from "@prisma/client";

export type Entity =
  | "board"
  | "column"
  | "task"
  | "subtask"
  | "sprint"
  | "section"
  | "user";

export type Action = "create" | "update" | "delete";

const permissions: Record<RoleType, Record<Entity, Record<Action, boolean>>> = {
  ADMIN: {
    board: { create: true, update: true, delete: true },
    column: { create: true, update: true, delete: true },
    task: { create: true, update: true, delete: true },
    subtask: { create: true, update: true, delete: true },
    sprint: { create: true, update: true, delete: true },
    section: { create: true, update: true, delete: true },
    user: { create: true, update: true, delete: true },
  },
  TEAM_LEAD: {
    board: { create: true, update: true, delete: false },
    column: { create: true, update: true, delete: true },
    task: { create: true, update: true, delete: false },
    subtask: { create: true, update: true, delete: false },
    sprint: { create: true, update: true, delete: false },
    section: { create: true, update: true, delete: false },
    user: { create: false, update: false, delete: false },
  },
  DEVELOPER: {
    board: { create: false, update: false, delete: false },
    column: { create: false, update: false, delete: false },
    task: { create: true, update: true, delete: false },
    subtask: { create: true, update: true, delete: true },
    sprint: { create: false, update: false, delete: false },
    section: { create: false, update: false, delete: false },
    user: { create: false, update: false, delete: false },
  },
  TESTER: {
    board: { create: false, update: false, delete: false },
    column: { create: false, update: false, delete: false },
    task: { create: true, update: true, delete: false },
    subtask: { create: true, update: true, delete: false },
    sprint: { create: false, update: false, delete: false },
    section: { create: false, update: false, delete: false },
    user: { create: false, update: false, delete: false },
  },
  MANAGER: {
    board: { create: true, update: true, delete: false },
    column: { create: true, update: true, delete: false },
    task: { create: true, update: true, delete: false },
    subtask: { create: true, update: true, delete: false },
    sprint: { create: true, update: true, delete: false },
    section: { create: true, update: true, delete: false },
    user: { create: false, update: false, delete: false },
  },
};

export const can = (
  roleType: RoleType | undefined | null,
  entity: Entity,
  action: Action
): boolean => {
  if (!roleType) return false;
  return permissions[roleType]?.[entity]?.[action] ?? false;
};
