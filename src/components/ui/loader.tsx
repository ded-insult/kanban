export const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500" />
    </div>
  );
};
