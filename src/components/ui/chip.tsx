import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

type Props = {
  onDelete: () => void;
} & React.ComponentProps<"p">;

const Chip = ({ className, children, onDelete, ...props }: Props) => {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium",
        "bg-gray-100 text-gray-700",
        "hover:bg-gray-200",
        "transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      <p>{children}</p>

      <Button className="ml-2 p-2.5" variant="destructive" onClick={onDelete}>
        X
      </Button>
    </div>
  );
};
export { Chip };
