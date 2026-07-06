type EmptyStateProps = {
  message: string;
};

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <p className="rounded-md border border-[#dedbd3] bg-white p-6 text-sm text-[#5f5a52]">
      {message}
    </p>
  );
}
