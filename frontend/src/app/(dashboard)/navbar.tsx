"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { House } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";

export function DashboardNavbar() {
  const pathanme = usePathname();
  const pathnameArray = pathanme.split("/").filter((_, i) => i !== 0);
  return (
    <nav className="sticky top-0 flex justify-between shrink-0 px-2 lg:px-5 py-2.5 border-b border-white/10 bg-black z-20">
      <div className="flex gap-2 items-center">
        <SidebarTrigger />
        <Separator orientation="vertical" />
        <Link href={'/home'} >
        <House size={16} className="text-muted-foreground dark:hover:text-white transition" />
        </Link>
        <Breadcrumb>
          <BreadcrumbList>
            {pathnameArray.map((path, i) => (
              <React.Fragment key={i}>
                <BreadcrumbSeparator />
                {pathnameArray.length - 1 !== i ? (
                  <React.Fragment key={i}>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        className="font-medium"
                        href={`/${pathnameArray
                          .filter((_, idx) => idx <= i)
                          .join("/")}`}
                      >
                        {path}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </React.Fragment>
                ) : (
                  <BreadcrumbItem className="font-medium">
                    {path.length > 7 ? `${path.slice(0, 7)}...` : path}
                  </BreadcrumbItem>
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex gap-x-3 mr-1 md:mr-3 w-fit">
        <div className="w-0 md:w-16"></div>
        <h1 className="text-2xl font-semibold">
          <Link href="/home">Ryomi</Link>
        </h1>
      </div>
    </nav>
  );
}
