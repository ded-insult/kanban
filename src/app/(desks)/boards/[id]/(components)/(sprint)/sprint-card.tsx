import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CalendarDays,
  ChevronUp,
  ChevronDown,
  ListTodo,
  Clock,
} from "lucide-react";
import { deleteSprintTask } from "../../(actions)";
import { Sprint, SprintStatus, Task } from "@prisma/client";
import { useSprintCard } from "./model/use-sprint-card";
import { useFilters } from "./model/use-filters";
import { LabelTask } from "@/components/ui/task-label";

type NewSprint = Sprint & {
  backlog: Task[];
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const sprintLocalize: Record<SprintStatus, string> = {
  NOT_STARTED: "Не начат",
  IN_PROGRESS: "В работе",
  COMPLETED: "Завершен",
};

const sprintStatusStyles: Record<SprintStatus, string> = {
  NOT_STARTED: "bg-red-100 text-red-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
};

const sprintCompletion: Record<SprintStatus, string> = {
  COMPLETED: "100%",
  IN_PROGRESS: "45%",
  NOT_STARTED: "0%",
};

export const SprintCard = ({
  sprint,
  boardId,
  canStart,
  bottomRightAction,
  canDeleteCardTask,
  canDeleteSprint,
}: {
  sprint: NewSprint;
  boardId: string;
  canStart: boolean;
  canDeleteSprint: boolean;
  canDeleteCardTask: boolean;
  bottomRightAction: React.ReactNode;
}) => {
  const card = useSprintCard(boardId);
  const filter = useFilters(sprint);

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-500 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900">{sprint.title}</h2>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 ${
              sprintStatusStyles[sprint.status]
            } rounded-full text-sm`}
          >
            {sprintLocalize[sprint.status]}
          </span>
          {canDeleteSprint && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => card.handleDeleteSprint(sprint.id)}
            >
              Удалить
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-gray-600">
          <CalendarDays className="w-4 h-4 mr-2" />
          <div className="text-sm">
            <p>
              <span className="font-medium">Начало:</span>{" "}
              {formatDate(sprint.startDate)}
            </p>
            <p>
              <span className="font-medium">Конец:</span>{" "}
              {formatDate(sprint.endDate)}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full animate-pulse"
              style={{ width: sprintCompletion[sprint.status] }}
            ></div>
          </div>
          <div className="flex justify-center text-sm text-gray-600 mt-2">
            <span>{sprintLocalize[sprint.status]}</span>
          </div>

          {canStart && (
            <Button
              className="w-full mt-4 bg-blue-500"
              onClick={() => card.handleStartSprint(sprint.id)}
            >
              Начать спринт
            </Button>
          )}
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">
              Задачи спринта:
            </h3>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Поиск задач..."
                className="h-8 w-48"
                value={filter.title}
                onChange={filter.handleTitleChange}
              />
              <Button variant="ghost" size="sm" onClick={card.handleExpand}>
                {card.isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {card.isExpanded && (
            <div className="space-y-2">
              {sprint.backlog.length > 0 ? (
                filter.filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-lg p-3 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <ListTodo className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">
                          {task.title}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {/* <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            {
                              LOW: "bg-gray-100 text-gray-700",
                              MEDIUM: "bg-blue-100 text-blue-700",
                              HIGH: "bg-orange-100 text-orange-700",
                              URGENT: "bg-red-100 text-red-700",
                            }[task.priority]
                          }`}
                        >
                          {priorityLabels[task.priority]}
                        </span> */}
                        <LabelTask priority={task.priority} />
                      </div>
                    </div>
                    {task.description && (
                      <p className="text-xs text-gray-500 mt-2">
                        {task.description}
                      </p>
                    )}
                    {(task.startDate || task.endDate) && (
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>
                          {task.startDate && formatDate(task.startDate)}
                          {task.endDate && ` - ${formatDate(task.endDate)}`}
                        </span>
                      </div>
                    )}

                    {canDeleteCardTask && (
                      <Button
                        variant="destructive"
                        onClick={() => {
                          deleteSprintTask(task.id);
                        }}
                      >
                        Удалить
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-3 text-sm text-gray-500">
                  Нет задач в спринте
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Всего задач: {sprint.backlog.length}
          </span>
          {canStart && bottomRightAction}
        </div>
      </div>
    </div>
  );
};
