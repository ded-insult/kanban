export const ContentLayout = ({
  children,
  header,
  actions,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) => {
  return (
    <div>
      <div className="container mx-auto px-4 py-8 flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{header}</h1>
        <div>{actions}</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );
};
