import { cn } from "@/lib/utils";

export function Horizon({ rotated }: { rotated: boolean }) {
  return (
    <div
      className={cn(
        "w-full h-48 flex flex-col items-center relative overflow-hidden",
        rotated && "rotate-180"
      )}
    >
      <div className="horizon-glow"></div>
      <div className="w-[1800px] h-[750px] rounded-[50%] bg-[#0a0a0a] absolute top-20"></div>
    </div>
  );
}
