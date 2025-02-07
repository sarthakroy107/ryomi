"use client";
import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export function Sales() {
  const router = useRouter();

  return (
    <div className="w-2/3 flex flex-col items-center mb-16">
      <p className="text-4xl font-extrabold text-transparent text-center bg-gradient-to-t from-white/85 to-white/65 bg-clip-text">
        Is this enough to convince you?
      </p>
      <p className="text-muted-foreground mt-4">
        Give <span className="text-white/75">Ryomi</span> a try to judge
        yourself
      </p>
      <div className="flex gap-x-7 mt-5 p-2">
        <Button
          onClick={() => router.push("/login")}
          className="group rounded-full relative w-32 flex justify-start px-5"
        >
          Get Started{" "}
          <ChevronRight
            size={5}
            className="absolute right-3.5 top-3 group-hover:right-3 transition-all"
          />{" "}
        </Button>
        <Button className="rounded-full" variant={"outline"}>
          Contact developer{" "}
        </Button>
      </div>
    </div>
  );
}
