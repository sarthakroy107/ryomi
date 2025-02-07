"use client";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useQuery } from "@tanstack/react-query";
import { reqHandler } from "@/lib/helpers/fetch.helper";
import { DashboardSchema } from "@/lib/zod/specific-purpose/dashboard.zod";
import { Skeleton } from "./ui/skeleton";

export function DisplayCards() {
  const { data, error, isLoading, isError } = useQuery({
    queryFn: () =>
      reqHandler({
        method: "get",
        path: "/dashboard",
        resValidator: DashboardSchema,
      }),
    queryKey: ["dashboard", "user"],
  });

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-3 lg:gap-4 px-3"
      )}
    >
      <Card>
        <CardHeader className="h-20">
          <CardTitle className={cn("")}>Vides uploaded</CardTitle>
          <CardDescription className={cn("")}>
            Videos available to operate on
          </CardDescription>
        </CardHeader>
        <CardContent className="text-start pl-0 mt-1.5 pb-0">
          <CardContent className={cn("text-xl md:text-2xl lg:text-3xl")}>
            {isLoading ? (
              <Skeleton className="w-full min-h-7" />
            ) : (
              data?.uploadedFiles
            )}
            {(isError || !data) && error?.message}
          </CardContent>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="h-20">
          <CardTitle className={cn("")}>Next deletions</CardTitle>
          <CardDescription className={cn("")}>
            Files to be deleted in next 3 days
          </CardDescription>
        </CardHeader>
        <CardContent className="text-start pl-0 mt-1.5 pb-0">
          <CardContent className={cn("text-xl md:text-2xl lg:text-3xl")}>
            {isLoading ? (
              <Skeleton className="w-full min-h-7" />
            ) : (
              data?.nextDeletions
            )}
            {(isError || !data) && error?.message}
          </CardContent>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="h-20">
          <CardTitle className={cn("")}>Ongoing tasks</CardTitle>
          <CardDescription className={cn("")}>Doing nour best</CardDescription>
        </CardHeader>
        <CardContent className="text-start pl-0 mt-1.5 pb-0">
          <CardContent className={cn("text-xl md:text-2xl lg:text-3xl")}>
            {isLoading ? (
              <Skeleton className="w-full min-h-7" />
            ) : (
              data?.ongoingTasks
            )}
            {(isError || !data) && error?.message}
          </CardContent>
        </CardContent>
      </Card>
    </div>
  );
}
