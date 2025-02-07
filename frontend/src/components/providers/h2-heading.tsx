import { cn } from "@/lib/utils";

export function H2Heading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        className,
        "text-xl md:text-3xl lg:text-4xl font-semibold text-white px-1.5 md:px-2.5 py-1 lg:py-1.5 mt-3 mb-5"
      )}
    >
      {children}
    </h2>
  );
}
