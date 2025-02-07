"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";
import { TCreditUsage } from "@/lib/zod/specific-purpose/credit-usage-schema.zod";

const cardData: {
  title: string;
  description?: string;
  value: number | string;
}[] = [
  { title: "Current credits", value: 960 },
  { title: "Credits used", description: "Total credits consumed", value: 270 },
  { title: "Purchase amount", description: "Total amount spent", value: 470 },
];

// const chartData1 = [
//   { date: "January", desktop: 186 },
//   { date: "February", desktop: 305 },
//   { date: "March", desktop: 237 },
//   { date: "April", desktop: 73 },
//   { date: "May", desktop: 209 },
//   { date: "June", desktop: 214 },
//   { date: "January", desktop: 186 },
//   { date: "February", desktop: 305 },
//   { date: "March", desktop: 237 },
//   { date: "April", desktop: 73 },
//   { date: "May", desktop: 209 },
//   { date: "June", desktop: 214 },
//   { date: "January", desktop: 186 },
//   { date: "February", desktop: 305 },
//   { date: "March", desktop: 237 },
//   { date: "April", desktop: 73 },
//   { date: "May", desktop: 209 },
//   { date: "June", desktop: 214 },
//   { date: "January", desktop: 186 },
//   { date: "February", desktop: 305 },
//   { date: "March", desktop: 237 },
//   { date: "April", desktop: 73 },
//   { date: "May", desktop: 209 },
//   { date: "June", desktop: 214 },
//   { date: "January", desktop: 186 },
//   { date: "February", desktop: 305 },
//   { date: "March", desktop: 237 },
//   { date: "April", desktop: 73 },
//   { date: "May", desktop: 209 },
//   { date: "June", desktop: 214 },
//   { date: "January", desktop: 0 },
//   { date: "February", desktop: 305 },
//   { date: "March", desktop: 237 },
//   { date: "April", desktop: 73 },
//   { date: "May", desktop: 209 },
//   { date: "June", desktop: 214 },
// ];

const chartConfig1 = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function CreditChart({ data }: { data: TCreditUsage }) {
  return (
    <Card className="">
      <CardHeader className="flex flex-row gap-3 border-b p-0 pt- mt-0">
        <div className="py-5 px-7 w-full lg:w-3/5 text-center">
          <CardTitle>Credit usage chart</CardTitle>
          <CardDescription className="mt-1">
            {new Date(data.recentUsage.dates.start).getDate()}/
            {new Date(data.recentUsage.dates.start).getMonth()}/
            {new Date(data.recentUsage.dates.start).getFullYear()} &nbsp; -
            &nbsp;
            {new Date(data.recentUsage.dates.end).getDate()}/
            {new Date(data.recentUsage.dates.end).getMonth()}/
            {new Date(data.recentUsage.dates.end).getFullYear()}
          </CardDescription>
        </div>
        <div className="hidden md:flex md:justify-between w-0 md:w-3/5 lg:w-2/5">
          <div className="border-l border-black/75 dark:border-white/15 py-3 text-center w-full">
            <CardDescription className="">Current credits</CardDescription>
            <CardTitle className="text-3xl">{data.currentAmount}</CardTitle>
          </div>
          <div className="border-l border-black/75 dark:border-white/15 py-3 text-center w-full">
            <CardDescription className="">
              Credits used in 30 days
            </CardDescription>
            <CardTitle className="text-3xl">
              {data.recentUsage.creditsUsed}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer className="" config={chartConfig1}>
          <BarChart
            accessibilityLayer
            data={data.recentUsage.usage}
            margin={{
              top: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              domain={[0, "dataMax"]}
              tickFormatter={(value) =>
                `${new Date(value).getDate()}/` +
                `${new Date(value).getMonth()}`
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="used"
              height={100}
              fill="var(--color-desktop)"
              radius={3}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground hidden md:block"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          You have used 270 credits in last 30 days
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total credits used in last 30 days
        </div>
      </CardFooter> */}
    </Card>
  );
}
