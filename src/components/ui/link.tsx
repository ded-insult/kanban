import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";

interface Props extends ComponentPropsWithoutRef<"a"> {}

export const LinkUI = ({ href, children, ...rest }: Props) => {
  return (
    <Link
      className="text-gray-700 hover:text-gray-900"
      href={href ?? "#"}
      {...rest}
    >
      {children}
    </Link>
  );
};
