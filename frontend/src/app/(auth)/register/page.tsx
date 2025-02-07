"use client";
import { RegistrationForm } from "@/components/registration-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function RegistrationPage() {
  const [screen, setScreen] = useState<"form" | "mail-sent">("form");
  return (
    <>
      {screen === "mail-sent" && <MailSentScreen />}
      {screen === "form" && (
        <RegistrationForm
          onSuccessfulRegistration={() => setScreen("mail-sent")}
        />
      )}
    </>
  );
}

function MailSentScreen() {
  return (
    <Card className="flex flex-col items-center md:border-0 md:rounded-none">
      <CardHeader>
        <div className="rounded-full p-5 w-fit">
          <Mail size={56} className="text-green-400/75" />
        </div>
      </CardHeader>
      <CardDescription className="text-xl font-semibold">
        Check your inbox
      </CardDescription>
      <CardContent className="mt-3 text-center w-full ">
        <p className="text-white/90 font-medium text-lg">
          We have sent you an email with a link.
        </p>
        <p className="mt-4 text-sm text-white/75">
          Click on the link to verify your email and complete registration
        </p>
        <div className="h-8" />
        <Link href="/login">
          <div className="bg-white/5 hover:bg-white/10 rounded p-2 transition-colors px-6 py-2 border border-white/5 w-full">
            Return to login page
          </div>
        </Link>
        <div className="h-4" />
      </CardContent>
    </Card>
  );
}
