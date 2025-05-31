export const BoardContentLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="flex gap-4">{children}</div>;
};
