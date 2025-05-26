"use client";
import { Role, Sprint, SprintStatus, Task, User } from "@prisma/client";
import { useLayoutEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { SprintDialog } from "../../../(components)/sprint-dialog";
import { Clock, ListTodo } from "lucide-react";
import { priorityLabels } from "@/lib/priority";
import { SprintTaskCreateDialog } from "./sprint-task-create-dialog";
import { getCurrentUser } from "@/lib/auth2";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  deleteSprint,
  deleteSprintTask,
  getSprint,
  startSprint,
} from "../(actions)";

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

export const SprintSection = () => {
  const [sprints, setSprints] = useState<NewSprint[]>([]);
  const [user, setUser] = useState<User & { role: Role }>();
  const [searchQuery, setSearchQuery] = useState<Record<string, string>>({});
  const [expandedSprints, setExpandedSprints] = useState<
    Record<string, boolean>
  >({});
  const params = useParams<{ id: string }>();
  const { id } = params;

  // Add helper function to filter tasks
  const filterTasks = (tasks: Task[], query: string) => {
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleStartSprint = async (sprintId: string) => {
    try {
      await startSprint(sprintId, id);
      // Refresh sprints data
      const updatedSprints = await getSprint(id);
      setSprints(updatedSprints);
    } catch (error) {
      console.error("Error starting sprint:", error);
      alert("Создайте хотя бы одну колонку для доски");
    }
  };

  useLayoutEffect(() => {
    getSprint(id).then((data) => {
      setSprints(data);
    });
    getCurrentUser().then((data) => {
      setUser(data as User & { role: Role });
    });
  }, []);

  const handleDeleteSprint = async (sprintId: string) => {
    if (
      !confirm(
        "Вы уверены, что хотите удалить спринт? Все задачи будут удалены."
      )
    ) {
      return;
    }

    try {
      await deleteSprint(sprintId);
      const updatedSprints = await getSprint(id);
      setSprints(updatedSprints);
    } catch (error) {
      console.error("Error deleting sprint:", error);
      alert("Ошибка при удалении спринта");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Спринты</h1>
        <SprintDialog
          onSprintCreated={() => {
            getSprint(id).then(setSprints);
          }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sprints.map((sprint) => (
          <div
            key={sprint.id}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">
                {sprint.title}
              </h2>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 ${
                    sprintStatusStyles[sprint.status]
                  } rounded-full text-sm`}
                >
                  {sprintLocalize[sprint.status]}
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteSprint(sprint.id)}
                >
                  Удалить
                </Button>
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
                {sprint.status === "NOT_STARTED" &&
                  !sprints.find(
                    (sprint) => sprint.status === "IN_PROGRESS"
                  ) && (
                    <Button
                      className="w-full mt-4 bg-blue-500"
                      onClick={() => handleStartSprint(sprint.id)}
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
                      value={searchQuery[sprint.id] || ""}
                      onChange={(e) =>
                        setSearchQuery((prev) => ({
                          ...prev,
                          [sprint.id]: e.target.value,
                        }))
                      }
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setExpandedSprints((prev) => ({
                          ...prev,
                          [sprint.id]: !prev[sprint.id],
                        }))
                      }
                    >
                      {expandedSprints[sprint.id] ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {expandedSprints[sprint.id] && (
                  <div className="space-y-2">
                    {sprint.backlog.length > 0 ? (
                      filterTasks(
                        sprint.backlog,
                        searchQuery[sprint.id] || ""
                      ).map((task) => (
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
                              {/* {task.assignee && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <User className="w-3 h-3 mr-1" />
                                  {task.assignee.name}
                                </div>
                              )} */}
                              <span
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
                              </span>
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
                                {task.endDate &&
                                  ` - ${formatDate(task.endDate)}`}
                              </span>
                            </div>
                          )}

                          <Button
                            variant="destructive"
                            onClick={async () => {
                              await deleteSprintTask(task.id);
                              await getSprint(id).then(setSprints);
                            }}
                          >
                            Удалить
                          </Button>
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

                {user && sprint.status !== "COMPLETED" && (
                  <SprintTaskCreateDialog
                    onTaskCreated={() => {
                      getSprint(id).then((data) => {
                        setSprints(data);
                      });
                    }}
                    sprintId={sprint.id}
                    userId={user.id}
                    userRole={user.role.role}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {sprints.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Нет активных спринтов</p>
        </div>
      )}
    </div>
  );
};
