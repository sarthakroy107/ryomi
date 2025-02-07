"use client";
import { reqHandler } from "@/lib/helpers/fetch.helper";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { RotateLoader } from "react-spinners";
import { toast } from "sonner";

export default function Page() {
  return (
    <Suspense fallback={<div> Loading</div>}>
      <Verify />
    </Suspense>
  );
}

function Verify() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const code = searchParams.get("code");
  const userId = searchParams.get("userId");

  useEffect(() => {
    (async () => {
      if (!code || !userId) {
        return;
      }
      try {
        await reqHandler({
          method: "get",
          path: `/verify-email?code=${code}&userId=${userId}`,
        });
        toast.success("Email verified");
        router.push("/home");
      } catch (error) {
        console.error(error);
        toast.error("An error occurred");
      }
    })();
  }, []);

  if (!code || !userId) {
    return <div>Invalid link</div>;
  }

  return (
    <main className="w-full h-screen flex justify-center items-center">
      <RotateLoader color="#fff" />
    </main>
  );
}
