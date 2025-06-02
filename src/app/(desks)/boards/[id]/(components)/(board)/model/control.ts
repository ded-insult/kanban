import { RoleType } from "@prisma/client";
import { can } from "@/shared/lib/permissions";

export const canUpdateBoard = (role: RoleType) => can(role, "board", "update");
export const canUpdateSprint = (role: RoleType) =>
  can(role, "sprint", "update");
