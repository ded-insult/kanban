import { ComponentPropsWithoutRef } from "react";

interface Props extends ComponentPropsWithoutRef<"h1"> {}

export const Typography = ({ children, ...rest }: Props) => {
  return (
    <div className="text-gray-700 hover:text-gray-900" {...rest}>
      {children}
    </div>
  );
};
