export function InputError({ error }: { error: string | undefined }) {
  return (
    <div className="min-h-4">
      {error && (
        <p className="text-xs text-red-400 text-opacity-85 pl-1.5">{error}</p>
      )}
    </div>
  );
}
