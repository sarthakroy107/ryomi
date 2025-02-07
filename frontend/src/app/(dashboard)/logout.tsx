"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/hooks/use-profile";
import { reqHandler } from "@/lib/helpers/fetch.helper";
import { useMutation } from "@tanstack/react-query";
import { ChevronsUpDown, CircleUserRound, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function LogoutComp() {
  const router = useRouter();
  const { data: user } = useProfile();
  const { isMobile } = useSidebar();
  const { mutate } = useMutation({
    mutationKey: ["logout", "user", "profile"],
    mutationFn: () =>
      reqHandler({
        path: "/logout",
        method: "post",
      }),

    onSuccess: () => router.push("/login"),
  });
  if (!user)
    return (
      <div className="w-full h-12 flex gap-x-2 items-center">
        <Skeleton className="w-12 h-full" />
        <div className="space-y-2.5">
          <Skeleton className="w-32 h-2" />
          <Skeleton className="w-40 h-3" />
        </div>
      </div>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full flex justify-between hover:bg-sidebar-accent data-[state=open]:bg-sidebar-accent p-1.5 rounded-sm items-center">
        <div className="flex gap-x-2 items-center">
          <div>
            <Image
              src={user.displayPic || ""}
              height={38}
              width={38}
              alt="profile image"
              className="rounded-md"
            />
          </div>
          <div className="text-start">
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <ChevronsUpDown size={20} className="text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="md:min-w-72"
        align="end"
        side={isMobile ? "bottom" : "right"}
      >
        <DropdownMenuLabel>
          <div className="flex gap-x-2 items-center p-1">
            <div>
              <Image
                src={user.displayPic || ""}
                height={38}
                width={38}
                alt="profile image"
                className="rounded-md"
              />
            </div>
            <div>
              <p className="text-sm">{user.name}</p>
              <p className="text-xs text-muted-foreground font-normal">
                {user.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={"/account"}>
            <DropdownMenuItem className="cursor-pointer">
              <CircleUserRound />
              Account
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => mutate()} className="cursor-pointer">
            <LogOut />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
