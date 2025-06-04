import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateBoardColumn } from "../(actions)";
import { toast } from "react-toastify";

const columnSchema = z.object({
  title: z.string().min(1, "Название столбца обязательно"),
});

type ColumnFormData = z.infer<typeof columnSchema>;

export const ColumnTitleUpdateDialog = ({
  columnId,
  initialTitle,
}: {
  columnId: string;
  initialTitle: string;
}) => {
  const form = useForm({
    resolver: zodResolver(columnSchema),
    defaultValues: {
      title: initialTitle,
    },
  });

  const onSubmit = async (data: ColumnFormData) => {
    try {
      await updateBoardColumn({
        id: columnId,
        title: data.title,
        status: data.title,
      });
      toast.success("Успех");
    } catch (error) {
      console.error("Ошибка при обновлении столбца", error);
      toast.error("Ошибка при обновлении столбца");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Изменить
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Изменить название столбца</DialogTitle>
          </DialogHeader>
          <Input
            {...form.register("title")}
            error={form.formState.errors.title}
            placeholder="Новое название"
          />
          <DialogFooter>
            <Button>Сохранить</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
