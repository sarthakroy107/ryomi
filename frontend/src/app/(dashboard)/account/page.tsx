"use client";

import { H2Heading } from "@/components/providers/h2-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfile } from "@/hooks/use-profile";
import { reqHandler } from "@/lib/helpers/fetch.helper";
import { useMutation } from "@tanstack/react-query";
import { MailCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MoonLoader, RotateLoader } from "react-spinners";
import { toast } from "sonner";

export default function SettingsPage() {
  const { isFetching, data } = useProfile();
  const [name, setName] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (data) setName(data.name);
  }, [data]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-profile", "user", "profile"],
    mutationFn: async () => {
      await reqHandler({
        method: "put",
        path: "/profile",
        body: { name, phoneNum: null, displayPic: data?.displayPic || null },
      });
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      router.refresh();
    },
    onError: (err) => {
      toast.error(err.message);
      if (data) setName(data.name);
    },
  });

  if (isFetching || !data) {
    return (
      <main className="w-full min-h-[80vh] flex justify-center items-center">
        <RotateLoader color="#fff" />
      </main>
    );
  }

  return (
    <main className="w-full flex flex-col items-center">
      <div className="w-full md:w-3/5 lg:w-2/5">
        <H2Heading className="ml-2">Settings</H2Heading>
        <form className="p-1 px-4">
          <div>
            <Label className="text-lg font-medium text-muted-foreground ml-1">
              Email
            </Label>
            <Input
              className="mt-2 text-lg rounded-[4px] bg-white/5"
              placeholder="Your email"
              value={data.email}
              readOnly={true}
              disabled={true}
            />
          </div>
          <div className="mt-3">
            <Label className="text-lg font-medium text-muted-foreground ml-1">
              Name
            </Label>
            <div className="flex justify-between items-center gap-x-2">
              <Input
                className="mt-2 text-lg rounded-[4px] bg-white/5"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Button
                disabled={data.name === name || isPending}
                className="rounded-[3px] w-20 mt-2"
                type="button"
                onClick={() => mutate()}
              >
                {isPending ? <MoonLoader color="#000" size={20} /> : "Save"}
              </Button>
            </div>
            <ForgetPasswordComp email={data.email} />
          </div>
        </form>
      </div>
    </main>
  );
}

function ForgetPasswordComp({ email }: { email: string }) {
  const [state, setState] = useState<
    "send-link" | "sending-link" | "link-success" | "link-error"
  >("send-link");

  const { mutate, isPending } = useMutation({
    mutationKey: ["send-password-reset-link", "user"],
    mutationFn: async () => {
      setState("sending-link");
      await reqHandler({
        method: "post",
        path: "/profile/reset-password",
        body: { email },
      });
    },
    onSuccess: () => setState("link-success"),
    onError: () => setState("link-error"),
  });

  return (
    <>
      {state === "send-link" ? (
        <div className="flex gap-x-1 items-center my-4">
          <p className="text-base text-muted-foreground">Forgot password?</p>
          <button
            disabled={false}
            className="text-blue-400 hover:underline cursor-pointer"
            onClick={() => mutate()}
            type="button"
          >
            Click here to reset
          </button>
        </div>
      ) : state === "sending-link" ? (
        <div className="flex gap-x-3 items-center mt-4">
          <p>Sending password reset email</p>
          <MoonLoader color="#fff" size={16} className="mt-0.5" />
        </div>
      ) : state === "link-success" ? (
        <div className="flex gap-x-3 items-center mt-4 bg-green-700/30 w-full px-4 py-2 rounded-sm border border-white/10">
          <MailCheck size={17} className="mt-0.5" />
          <p>
            <span className="text-white/75">Mail sent to</span> &nbsp;
            <span className="font-medium">{email}</span>
          </p>
        </div>
      ) : (
        <div className="flex gap-x-3 items-center mt-4 bg-red-700/30 w-full px-4 py-2 rounded-sm border border-white/10">
          <MailCheck size={17} className="mt-0.5" />
          <p>
            <span className="text-white/75">Unable to send mail to</span> &nbsp;
            <span className="font-medium">{email}</span>
          </p>
        </div>
      )}
    </>
  );
}
