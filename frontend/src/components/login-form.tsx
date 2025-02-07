"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { reqHandler } from "@/lib/helpers/fetch.helper";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { MoonLoader } from "react-spinners";

type TLoginForm = {
  email: string;
  password: string;
};

export function LoginForm() {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: TLoginForm) =>
      reqHandler({
        method: "post",
        path: "/login",
        body: data,
      }),
    onSuccess: () => {
      toast.success("Logged in successfully");
      router.push("/home");
    },
    onError: (error) => {
      console.log(`Error: ${error.message}`);
      toast.error(error.message);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })
    ),
  });

  const onSubmit: SubmitHandler<TLoginForm> = (data) => mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="mx-auto max-w-sm bg-[#0a0a0a] md:min-h-[33rem] rounded-none md:rounded-[3px] border-0">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                placeholder="m@example.com"
                className="rounded-[3px]"
                {...register("email", {
                  required: true,
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Entered value does not match email format",
                  },
                })}
              />
              {errors.email && (
                <p className="text-xs text-red-400 text-opacity-85 pl-1.5">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input type="password" className="rounded-[3px]" {...register("password", { required: true })} />
              {errors.password && (
                <p className="text-xs text-red-400 text-opacity-85 pl-1.5">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full rounded-[3px]">
              {isPending ? <MoonLoader color="#000" size={20} /> : "Login"}
            </Button>
            {/* <Button variant="outline" className="w-full">
              Login with Google
            </Button> */}
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
