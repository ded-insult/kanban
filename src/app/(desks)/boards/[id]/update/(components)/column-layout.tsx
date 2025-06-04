export const ColumnLayout = ({
  children,
  header,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div className="p-4 border rounded-xl bg-white space-y-4 shadow-sm">
      <h3 className="text-lg font-semibold">{header}</h3>
      {children}
    </div>
  );
};
