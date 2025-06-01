import { TaskPriority } from "@prisma/client";

const priorityLabels: Record<TaskPriority, string> = {
  LOW: "Низкий",
  MEDIUM: "Средний",
  HIGH: "Высокий",
  URGENT: "Срочный",
};

const priorityColors: Record<TaskPriority, string> = {
  LOW: "bg-green-100 text-green-800",
  MEDIUM: "bg-blue-100 text-blue-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800",
};

interface LabelTaskProps {
  priority: TaskPriority;
  as?: "span" | "option";
}

export const LabelTask = ({ priority, as = "span" }: LabelTaskProps) => {
  if (as === "span") {
    return (
      <span
        className={`text-xs px-2 py-1 rounded-full w-fit ${priorityColors[priority]}`}
      >
        {priorityLabels[priority]}
      </span>
    );
  }

  return (
    <option key={priority} value={priority}>
      {priorityLabels[priority]}
    </option>
  );
};

export const PriorityOptionsList = () => {
  return (
    <>
      {Object.keys(priorityLabels).map((priority) => (
        <LabelTask key={priority} as="option" priority={priority as any} />
      ))}
    </>
  );
};
