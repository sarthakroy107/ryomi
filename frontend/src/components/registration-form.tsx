"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { InputError } from "./input-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { APIError, reqHandler } from "@/lib/helpers/fetch.helper";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MoonLoader } from "react-spinners";

type TRegistrationForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function RegistrationForm({
  onSuccessfulRegistration,
}: {
  onSuccessfulRegistration: () => void;
}) {
  const [emailInUse, setEmailInUse] = useState(false);

  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: TRegistrationForm) => {
      const response = await reqHandler({
        method: "post",
        path: `/register`,
        body: data,
      });
    },
    onSuccess: () => {
      toast.success("Registration successful");
      onSuccessfulRegistration();
    },
    onError: (error) => {
      console.log(error);
      if (error instanceof APIError) {
        console.error(`APIError: ${error.message}`);
        if (error.status === 409) {
          setEmailInUse(true);
          // toast.error("User with this email already exists");
          return;
        }
      }
      toast.error(error.message);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TRegistrationForm>({
    resolver: zodResolver(
      z
        .object({
          name: z.string(),
          email: z.string().email(),
          password: z
            .string()
            .regex(
              /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?~])[A-Za-z\d!@#$%^&*?~]{6,}$/,
              {
                message:
                  "Password must contain at least one uppercase letter, one number, one special character (!@#$%^&*?~), and be at least 6 characters long",
              }
            ),
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Passwords do not match",
        })
    ),
  });

  const onSubmit: SubmitHandler<TRegistrationForm> = async (data) => {
    mutate(data);
  };

  return (
    <Card className="min-w-[22rem] border-0 rounded-none">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Provide details to register</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-1.5">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              className="rounded-[3px]"
              placeholder="John Doe"
              {...register("name", { required: true })}
            />
            <InputError error={errors.name?.message} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              className="rounded-[3px]"
              placeholder="name@example.com"
              {...register("email", {
                required: true,
                onChange: () => setEmailInUse(false),
              })}
            />
            <InputError
              error={
                emailInUse
                  ? "Use with this email already exists"
                  : errors.email?.message
              }
            />
            {/* {emailInUse && (
              <InputError error="User with this email already exists" />
            )} */}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              className="rounded-[3px]"
              type="password"
              {...register("password", { required: true })}
            />
            <InputError error={errors.password?.message} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm password</Label>
            <Input
              className="rounded-[3px]"
              {...register("confirmPassword", { required: true })}
            />
            <InputError error={errors.confirmPassword?.message} />
          </div>
          <Button type="submit" className="rounded-[3px]" disabled={emailInUse}>
            {isPending ? <MoonLoader size={20} color="#000" /> : "Register"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
