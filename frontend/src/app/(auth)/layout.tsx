import { GithubIcon, LinkedinIcon, TwitterIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen flex justify-center md:items-center bg-[#0f0f0f] px-4">
      <div className="w-full md:w-4/5 lg:w-1/2 max-w-[880px] md:h-[33rem] flex flex-col md:flex-row overflow-hidden rounded-[3px] md:rounded-sm">
        <div className="md:w-3/5 gap-6 flex flex-col justify-center items-center md:bg-[#1f1f1f]">
          <Image
            src={"./ryomi-dark.png"}
            alt="company logo"
            width={76}
            height={40}
            draggable={false}
            className="w-64 min-w-8 mt-12 mb-8"
          />

          <div className="hidden mt-8 md:flex gap-x-1.5 justify-center">
            <Link
              target="_blank"
              href="https://github.com/sarthakroy107/ryomi"
              className="hover:bg-white/5 p-2 rounded-[5px] group transition-all"
            >
              <GithubIcon
                size={25}
                className="text-muted-foreground group-hover:text-white/75"
              />
            </Link>
            <Link
              target="_blank"
              href="https://x.com/sarthakroy107"
              className="hover:bg-white/5 p-2 rounded-[5px] group transition-all"
            >
              <TwitterIcon
                size={25}
                className="text-muted-foreground group-hover:text-white/75"
              />
            </Link>
            <Link
              target="_blank"
              href="https://www.linkedin.com/in/sarthakroy107"
              className="hover:bg-white/5 p-2 rounded-[5px] group transition-all"
            >
              <LinkedinIcon
                size={25}
                className="text-muted-foreground group-hover:text-white/75"
              />
            </Link>
          </div>
        </div>
        <div className="w-full md:w-2/5 lg:max-w-[375px]">{children}</div>
      </div>
    </div>
  );
}
