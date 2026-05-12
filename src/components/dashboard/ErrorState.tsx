type ErrorStateProps = {
  title?: string;
  message: string;
};

export function ErrorState({
  title = "No se pudieron cargar los datos",
  message,
}: ErrorStateProps) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-950">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm leading-6">{message}</p>
    </div>
  );
}
