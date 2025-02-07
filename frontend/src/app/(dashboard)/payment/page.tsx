"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { reqHandler } from "@/lib/helpers/fetch.helper";
import { paymentSchema } from "@/lib/zod/genral-purpose/base-schemas.zod";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, ArrowRight, CopyIcon, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { formatDate } from "@/lib/helpers/date-formatter";
import { Suspense } from "react";
import Link from "next/link";

export default function Page() {
  return (
    <Suspense fallback={<PendingState />}>
      <PaymentPage />
    </Suspense>
  );
}
function PaymentPage() {
  const searchParams = useSearchParams();
  const { data, error, isFetching } = useQuery({
    queryKey: ["payment", searchParams.get("id")],
    queryFn: async () => {
      if (!searchParams.get("id")) {
        throw new Error("Payment id not provided in URL");
      }

      return reqHandler({
        path: `/payment/${searchParams.get("id")}`,
        method: "get",
        resValidator: paymentSchema,
      });
    },
    staleTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
  });

  if (isFetching) {
    return <PendingState />;
  }

  if (!searchParams.get("id")) {
    return (
      <PaymentError
        errorTitle="Payment Id not found"
        errorDescription="Payment id not provided in URL"
      />
    );
  }

  if (error) {
    return (
      <PaymentError
        errorTitle="Payment Error"
        errorDescription={error.message}
      />
    );
  }

  if (!data) {
    return (
      <PaymentError
        errorTitle="Payment data not found"
        errorDescription="Payment data not found"
      />
    );
  }

  return (
    <div className="md:min-h-[50rem] flex items-center justify-center p-4">
      <Card className="w-full dark:bg-black/20 md:max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto my-4 bg-green-100 text-green-600 rounded-full p-3 w-16 h-16 flex items-center justify-center">
            <CheckCircle className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600 dark:text-white/80">
            Thank you for your purchase. Your payment has been processed
            successfully.
          </p>
          <div className="bg-gray-50 dark:bg-white/5 dark:text-white border border-black/10 dark:border-white/10 text-gray-600 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction ID:</span>
              <div className="font-medium flex gap-x-1 items-center">
                <p>{data.id}</p>
                <Tooltip>
                  <TooltipTrigger
                    onClick={() => {
                      navigator.clipboard.writeText(data.id);
                      toast.success("Copied to clipboard");
                    }}
                    className="p-1.5 hover:bg-white/10 rounded-[4px]"
                  >
                    <CopyIcon className="w-4 h-4" />
                  </TooltipTrigger>
                  <TooltipContent>Copy Id</TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Razorpay order ID:</span>
              <div className="font-medium flex gap-x-1 items-center">
                <p>{data.pgRefId}</p>
                <Tooltip>
                  <TooltipTrigger
                    onClick={() => {
                      navigator.clipboard.writeText(data.pgRefId);
                      toast.success("Copied to clipboard");
                    }}
                    className="p-1.5 hover:bg-white/10 rounded-[4px]"
                  >
                    <CopyIcon className="w-4 h-4" />
                  </TooltipTrigger>
                  <TooltipContent>Copy Id</TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount Paid:</span>
              <span className="font-medium">₹{data.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method:</span>
              <span className="font-medium">{data.method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{formatDate(data.updatedAt)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Link href="/home" className="w-full">
            <Button className="group w-full transition-all">
              Return to Dashboard
              <ArrowRight className="relative right-0 group-hover:-right-1 transition-all ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

function PaymentError({
  errorTitle,
  errorDescription,
}: {
  errorTitle: string;
  errorDescription: string;
}) {
  return (
    <div className="md:min-h-[50rem] flex items-center justify-center p-4">
      <Card className="w-full dark:bg-black/20 md:max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto my-4 bg-red-100 text-red-600 rounded-full p-3 w-16 h-16 flex items-center justify-center">
            <X className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">
            {errorTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600 dark:text-white/80">
            {errorDescription}
          </p>
        </CardContent>
        <CardFooter>
          <Link href="/home" className="w-full">
            <Button className="group w-full transition-all">
              Return to Dashboard
              <ArrowRight className="relative right-0 group-hover:-right-1 transition-all ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

function PendingState() {
  return (
    <div className="md:min-h-[50rem] flex items-center justify-center p-4">
      <Card className="w-full dark:bg-black/20 md:max-w-md min-h-80">
        <CardHeader className="flex justify-center w-full">
          <CardTitle className="flex justify-center w-full mt-2 ">
            <Skeleton className="w-16 h-16 rounded-full" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="w-full h-5" />
          <Skeleton className="w-full h-32" />

          <Skeleton className="w-full h-9" />
        </CardContent>
      </Card>
    </div>
  );
}
