"use client";
import { Sprint, Task } from "@prisma/client";
import { useEffect, useState } from "react";
import { getSprint } from "../(actions)/sprint-actions";
import { useParams } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { SprintDialog } from "./sprint-dialog";
import { Button } from "@/components/ui/button";
import { Clock, ListTodo, User } from "lucide-react";
import { priorityLabels } from "@/lib/priority";

type NewSprint = Sprint & {
  backlog: Task[];
};

export const SprintSection = () => {
  const [sprints, setSprints] = useState<NewSprint[]>([]);
  const params = useParams<{ id: string }>();
  const { id } = params;

  useEffect(() => {
    getSprint(id).then((data) => {
      setSprints(data);
    });
  }, []);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Спринты</h1>
        {/* <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Создать спринт
        </Button> */}
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
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                В работе
              </span>
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
                    style={{ width: "60%" }}
                  ></div>
                </div>
                <div className="flex justify-center text-sm text-gray-600 mt-2">
                  <span>Спринт в процессе</span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Задачи спринта:
                </h3>
                <div className="space-y-2">
                  {sprint.backlog.length > 0 ? (
                    sprint.backlog.map((task) => (
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
                              {task.endDate && ` - ${formatDate(task.endDate)}`}
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-3 text-sm text-gray-500">
                      Нет задач в спринте
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Всего задач: {sprint.backlog.length}
                </span>
                <Button variant="outline" size="sm">
                  Добавить задачу
                </Button>
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
