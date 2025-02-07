"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Banknote } from "lucide-react";
import { CreditChart } from "./credit-chart";
import { H2Heading } from "@/components/providers/h2-heading";
import { useQuery } from "@tanstack/react-query";
import { reqHandler } from "@/lib/helpers/fetch.helper";
import { CreditUsageSchema } from "@/lib/zod/specific-purpose/credit-usage-schema.zod";
import { Skeleton } from "@/components/ui/skeleton";
import { H3Heading } from "@/components/providers/h3-heading";

const cardData: {
  title: string;
  description?: string;
  value: number | string;
}[] = [
  { title: "Current credits", value: 960 },
  { title: "Credits used", description: "Total credits consumed", value: 270 },
  { title: "Purchase amount", description: "Total amount spent", value: 470 },
];

export default function UsagePage() {
  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["usage", "credits"],
    queryFn: () =>
      reqHandler({
        method: "get",
        path: "/credits/usage",
        resValidator: CreditUsageSchema,
      }),
    staleTime: 1000 * 60 * 25,
    refetchOnWindowFocus: false,
  });

  if (isFetching) {
    return (
      <main className="w-full flex flex-col items-center p-5 py-0 md:p-8 lg:p-10 gap-7">
        <div className="w-full lg:w-3/4 lg:max-w-5xl space-y-5">
          <H2Heading className="mt-0 pt-0">Credit analysis</H2Heading>
          <div className="flex w-full flex-col md:flex-row gap-y-3 md:justify-between">
            <Skeleton className="w-full md:w-1/2 h-28 md:h-16" />
            <Skeleton className="w-full md:w-1/5 h-28 md:h-16" />
            <Skeleton className="w-full md:w-1/5 h-28 md:h-16" />
          </div>
          <Skeleton className="w-full h-96" />
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="w-full h-[92vh] flex justify-center items-center">
        <H3Heading className="mt-0 pt-0">Error: {error?.message}</H3Heading>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="w-full flex flex-col items-center p-5 py-0 md:p-8 lg:p-10 gap-7">
        <div className="w-full lg:w-3/4 lg:max-w-5xl space-y-5">
          <H2Heading className="mt-0 pt-0">Credit analysis</H2Heading>
          <div className="flex w-full flex-col md:flex-row gap-y-3 md:justify-between">
            <Skeleton className="w-full md:w-1/2 h-28 md:h-16" />
            <Skeleton className="w-full md:w-1/5 h-28 md:h-16" />
            <Skeleton className="w-full md:w-1/5 h-28 md:h-16" />
          </div>
          <Skeleton className="w-full h-96" />
        </div>
      </main>
    );
  }

  return (
    <main className="w-full flex flex-col items-center p-5 py-0 md:p-8 lg:p-10">
      <div className="w-full lg:w-3/4 lg:max-w-5xl">
        <H2Heading className="mt-0 pt-0">Credit analysis</H2Heading>
        <div className="w-full gap-4 md:gap-3.5 lg:gap-5 flex flex-col md:hidden justify-between mb-5">
          {cardData.map((card, index) => (
            <Card key={index} className="w-full md:w-72 lg:w-80">
              <CardHeader>
                <CardDescription className="text-sm font-medium flex justify-between items-center">
                  <p>{card.title}</p>
                  <Banknote className="w-5 h-5" />
                </CardDescription>
                <CardTitle className="text-3xl mt-2.5">{card.value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
        <CreditChart data={data} />
      </div>
    </main>
  );
}
