"use client";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  roleLocalization,
  rolesList,
} from "@/shared/constants/roles-lozalization";
import { RoleType } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";
import { toast } from "react-toastify";
import { createRoleByName } from "../(actions)";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

const roleSchema = z.object({
  name: z.string().min(3, "Название роли должно содержать минимум 3 символа"),
  type: z.nativeEnum(RoleType, {
    errorMap: () => ({ message: "Выберите тип роли" }),
  }),
});

type RoleFormData = z.infer<typeof roleSchema>;

export const FormCreateRoleDialog = () => {
  const router = useRouter();
  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      type: RoleType.DEVELOPER,
    },
  });

  const onSubmit = async (data: RoleFormData) => {
    try {
      await createRoleByName(data.name, data.type);
      toast.success("Роль успешно создана!", { autoClose: 1750 });
      form.resetField("name");
      router.refresh();
    } catch (error) {
      toast.error("Возможно, роль уже существует", { autoClose: 1750 });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full p-2 rounded mb-2">
          Хотите создать новую роль?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Создать новую роль</DialogTitle>
          <DialogDescription>
            Диалоговое окно для создания новой роли
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Label htmlFor="name">Имя роли</Label>
          <Input
            {...form.register("name")}
            id="name"
            placeholder="Имя вашей новой роли"
            className="col-span-3"
            error={form.formState.errors.name}
          />

          <Label htmlFor="type">Тип роли</Label>
          <Controller
            control={form.control}
            name="type"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  error={form.formState.errors.type}
                  className="w-full"
                >
                  <SelectValue placeholder="Выберите тип роли" />
                </SelectTrigger>
                <SelectContent>
                  {rolesList.map((role) => (
                    <SelectItem key={role} value={role}>
                      {roleLocalization[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <DialogFooter>
            <Button type="submit">Создать роль</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
