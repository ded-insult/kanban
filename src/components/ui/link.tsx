import { cva } from "class-variance-authority";
import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";

const linkVariants = cva(
  "cursor-pointer inline-flex items-center whitespace-nowrap text-md font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 outline-none",
  {
    variants: {
      theme: {
        dark: "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100",
        light: "text-gray-300 hover:text-white",
      },
      active: {
        true: "text-indigo-600 dark:text-indigo-400 font-semibold",
      },
    },
    compoundVariants: [
      {
        theme: "dark",
        active: true,
        class: "bg-gray-100 dark:bg-gray-700/50",
      },
    ],
    defaultVariants: {
      theme: "dark",
    },
  }
);

interface Props extends ComponentPropsWithoutRef<"a"> {
  theme?: "dark" | "light";
  active?: boolean;
}

export const LinkUI = ({
  href,
  children,
  theme,
  active,
  className,
  ...rest
}: Props) => {
  return (
    <Link
      className={linkVariants({
        theme,
        active,
        className: `px-4 py-2.5 rounded-lg ${className}`,
      })}
      href={href ?? "#"}
      {...rest}
    >
      {children}
    </Link>
  );
};

// Иконки для примера (можно заменить на реальные)
export const BoardIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
    />
  </svg>
);

export const PermissionIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

export const SettingsIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);
