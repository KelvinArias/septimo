export function RouteErrorBanner({ message }: { message: string }) {
  return (
    <div className="mx-4 mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 md:mx-5 lg:mx-7">
      {message}
    </div>
  );
}

export function RouteLoadingBanner() {
  return (
    <div className="fixed bottom-4 right-0 mx-4 mt-4 rounded-md border border-[#dedbd3] bg-white px-4 py-3 text-sm text-[#5f5a52] md:mx-5 lg:mx-7">
      Loading data...
    </div>
  );
}
