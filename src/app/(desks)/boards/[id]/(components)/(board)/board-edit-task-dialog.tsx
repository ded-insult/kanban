"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Subtask, Task, TaskPriority } from "@prisma/client";
import { deleteTask, updateTask } from "../../../../(actions)";
import { PriorityOptionsList } from "@/components/ui/task-label";
import { BoardParticipants } from "../../page";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSubtasksUpdate } from "./model/use-subtasks-update";
import { toast } from "react-toastify";

interface EditTaskDialogProps {
  task: Task & {
    subtasks: Subtask[];
  };
  canDelete: boolean;
  userList: BoardParticipants;
}

const taskSchema = z.object({
  title: z.string().min(1, "Название обязательно"),
  description: z.string().optional(),
  asssigneId: z.string().optional(),
  priority: z.nativeEnum(TaskPriority),
});

type TaskFormData = z.infer<typeof taskSchema>;

export const BoardEditTaskDialog = ({
  task,
  userList,
  canDelete,
}: EditTaskDialogProps) => {
  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      asssigneId: task.assigneeId as string | undefined,
      description: task.description as string | undefined,
      priority: task.priority,
      title: task.title,
    },
  });

  const subtasksUpdate = useSubtasksUpdate(task.subtasks);

  const handleDelete = async () => {
    if (confirm("Вы уверены, что хотите удалить задачу?")) {
      try {
        await deleteTask(task.id);
        alert("Задача удалена");
      } catch (error) {
        alert("Ошибка при удалении задачи");
      }
    }
  };

  const onSubmit = async (data: TaskFormData) => {
    // alert(1);
    try {
      // throw Error();
      await updateTask({
        id: task.id,
        assigneeId: task.assigneeId,
        priority: data.priority,
        title: data.title,
        description: data.description,
        subtasks: subtasksUpdate.data,
      });
      toast.success("Данные обновлены");
    } catch (e) {
      toast.error("Ошибка");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Редактировать
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[600px] overflow-y-auto">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Редактировать задачу</span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block mb-2">Название</label>
              <input
                {...form.register("title")}
                type="text"
                name="title"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">Описание</label>
              <textarea
                {...form.register("description")}
                name="description"
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>
            <div>
              <label className="block mb-2">Подзадачи</label>

              {subtasksUpdate.data.map((task) => (
                <div key={task.id} className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={subtasksUpdate.updateSubtask(
                      task.id,
                      "completed"
                    )}
                    className="mr-2"
                  />
                  <input
                    type="text"
                    value={task.title}
                    onChange={subtasksUpdate.updateSubtask(task.id, "title")}
                    className="flex-1 p-2 border rounded"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block mb-2">Исполнитель</label>
              <select
                {...form.register("asssigneId")}
                name="assigneeId"
                className="w-full p-2 border rounded"
              >
                <option value="">Не назначен</option>
                {userList?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2">Приоритет</label>
              <select
                {...form.register("priority")}
                name="priority"
                className="w-full p-2 border rounded"
              >
                <PriorityOptionsList />
              </select>
            </div>
          </div>
          <DialogFooter>
            {canDelete && (
              <Button variant="destructive" onClick={handleDelete}>
                Удалить
              </Button>
            )}
            <Button variant="default">Сохранить</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
