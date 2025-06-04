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
import { Input } from "@/components/ui/input";
import { updateBoardTitle } from "../(actions)";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface UpdateBoardTitleDialogProps {
  boardId: string;
  initialTitle: string;
}

const titleSchema = z.object({
  title: z.string().min(1, "Название доски обязательно"),
});

type TitleFormData = z.infer<typeof titleSchema>;

export const BoardTitleUpdateDialog = ({
  boardId,
  initialTitle,
}: UpdateBoardTitleDialogProps) => {
  const form = useForm({
    resolver: zodResolver(titleSchema),
    defaultValues: {
      title: initialTitle,
    },
  });

  const onSubmit = async (data: TitleFormData) => {
    try {
      await updateBoardTitle(boardId, data.title);
      toast.success("Успешно");
    } catch (error) {
      console.error("Ошибка при обновлении названия доски", error);
      toast.error("Ошибка при обновлении названия доски");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-4">
          Изменить название
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Изменить название доски</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input
                {...form.register("title")}
                error={form.formState.errors.title}
                placeholder="Новое название доски"
              />
            </div>
          </div>
          <DialogFooter>
            <Button>Сохранить</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
