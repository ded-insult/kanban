import { Sprint } from "@prisma/client";
import { Sprints, User } from "../../../page";
import { can } from "@/lib/permissions";

// Start sprint
export const noActiveSprint = (sprints: Sprints) => {
  return !sprints.filter((sprint) => sprint.status === "IN_PROGRESS").length;
};

export const sprintIsOverOrInProgress = (sprint: Sprint) => {
  return sprint.status === "IN_PROGRESS" || sprint.status === "COMPLETED";
};

export const canStartSprint = (sprints: Sprints, sprint: Sprint) => {
  return !sprintIsOverOrInProgress(sprint) && noActiveSprint(sprints);
};

// delete sprint
const canUserDeleteSprint = (user: User) =>
  can(user!.role.role, "sprint", "delete");

export const canDeleteSprint = (user: User, sprint: Sprint) =>
  canUserDeleteSprint(user) && sprint.status !== "IN_PROGRESS";

// delete card task

const canDeleteCardTask = (user: User) =>
  can(user!.role.role, "task", "delete");

export const canDeleteTask = (user: User, sprint: Sprint) =>
  canDeleteCardTask(user) && sprint.status !== "COMPLETED";
