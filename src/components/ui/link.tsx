import { cva } from "class-variance-authority";
import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";

const linkVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 shrink-0  outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      theme: {
        dark: "text-gray-700 hover:text-gray-900",
        light: "text-gray-300 hover:text-gray-100",
      },
    },
    defaultVariants: {
      theme: "dark",
    },
  }
);

interface Props extends ComponentPropsWithoutRef<"a"> {
  theme?: "dark" | "light";
}

export const LinkUI = ({ href, children, theme, ...rest }: Props) => {
  return (
    <Link className={linkVariants({ theme })} href={href ?? "#"} {...rest}>
      {children}
    </Link>
  );
};
