import React from "react";

import { cn } from "@/lib/utils";

const Wrapper = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  );
};

const Header = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div className={cn("flex flex-col gap-1.5 px-6", className)} {...props} />
  );
};

const Title = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div className={cn("leading-none font-semibold", className)} {...props} />
  );
};

const Description = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
};

const Content = ({ className, ...props }: React.ComponentProps<"div">) => {
  return <div className={cn("px-6", className)} {...props} />;
};

const Footer = ({ className, ...props }: React.ComponentProps<"div">) => {
  return <div className={cn("flex items-center px-6", className)} {...props} />;
};

const Card = {
  Wrapper,
  Header,
  Footer,
  Title,
  Description,
  Content,
};

export { Card };
