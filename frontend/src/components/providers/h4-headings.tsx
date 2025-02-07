import { cn } from "@/lib/utils";

export function H4Heading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "text-lg md:text-lg lg:text-xl font-semibold text-white px-1.5 md:px-2.5 py-1 lg:py-1.5 mt-2 mb-3",
        className
      )}
    >
      {children}
    </h2>
  );
}
