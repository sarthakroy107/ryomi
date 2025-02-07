"use client";

import { InputError } from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { reqHandler } from "@/lib/helpers/fetch.helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { MoonLoader } from "react-spinners";
import { z } from "zod";

const validator = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type TFormValues = z.infer<typeof validator>;

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnnecessaryCompForNext />
    </Suspense>
  );
}

function UnnecessaryCompForNext() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const userId = searchParams.get("userId");
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<TFormValues>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(validator),
  });
  const { mutate, isPending } = useMutation({
    mutationKey: ["reset-password"],
    mutationFn: async (data: {
      password: string;
      userId: string;
      code: string;
    }) => {
      await reqHandler({
        method: "put",
        path: "/profile/reset-password",
        body: {
          password: data.password,
          userId: data.userId,
          verificationCode: data.code,
        },
      });
    },
  });

  function onSubmit(data: TFormValues) {
    if (!code || !userId) return;
    mutate({ password: data.password, userId, code });
  }

  if (!code || !userId) {
    return <div>Invalid request</div>;
  }

  return (
    <main className="w-full min-h-[80vh] flex justify-center items-center">
      <Card className="min-w-80 rounded-[4px]">
        <CardHeader className="text-xl md:text-xl lg:text-2xl font-semibold text-white/80">
          Reset passaword
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="p-1">
            <div className="mb-4 flex flex-col gap-y-2">
              <Label className="text-lg font-medium">Password</Label>
              <Input
                className="rounded-[3px]"
                type="password"
                {...register("password")}
              />
              <InputError error={errors.password?.message} />
            </div>
            <div className="mb-4 flex flex-col gap-y-2">
              <Label className="text-lg font-medium">Confirm Password</Label>
              <Input
                className="rounded-[3px]"
                type="password"
                {...register("confirmPassword")}
              />
              <InputError error={errors.confirmPassword?.message} />
            </div>
            <Button type="submit" className="rounded-[3px] mt-1">
              {isPending ? <MoonLoader size={20} color="#000" /> : "Reset"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
