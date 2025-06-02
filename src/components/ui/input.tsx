import * as React from "react";

import { cn } from "@/shared/lib/utils";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

function Input({
  className,
  type,
  error,
  ...props
}: React.ComponentProps<"input"> & {
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<{}>>;
}) {
  return (
    <>
      <input
        type={type}
        data-slot="input"
        className={cn(
          "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          error &&
            "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/50",
          className
        )}
        aria-invalid={error ? "true" : undefined}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1">{error && error.message}</p>
      )}
    </>
  );
}

export { Input };
