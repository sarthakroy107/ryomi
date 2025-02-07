"use client";

import { InputError } from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { reqHandler } from "@/lib/helpers/fetch.helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { MoonLoader } from "react-spinners";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
});

type TForm = z.infer<typeof schema>;

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TForm>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(schema),
  });
  const [isSent, setIsSent] = useState(false);

  const onSubmit = async (data: TForm) => {
    try {
      await reqHandler({
        method: "post",
        path: "/profile/reset-password",
        body: { email: data.email },
      });
      setIsSent(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reset link");
    }
  };

  return (
    <main className="w-full min-h-[33rem] bg-[#0a0a0a] p-6">
      <h2 className="text-2xl font-semibold text-white/85">Reset password</h2>
      <p className="text-sm text-white/65 font-medium mt-2 mb-10">
        Enter your email to get password reset link
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          placeholder="name@example.com"
          type="email"
          className="rounded-[3px] mb-3"
          {...register("email")}
        />
        <InputError error={errors.email?.message} />
        <Button
          disabled={isSubmitting || isSent}
          type="submit"
          className="w-full mt-4 rounded-[3px]"
        >
          {isSubmitting ? (
            <MoonLoader size={20} color="#000" />
          ) : (
            "Send reset link"
          )}
        </Button>
      </form>
    </main>
  );
}
