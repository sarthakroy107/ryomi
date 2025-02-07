import Image from "next/image";
import Link from "next/link";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/20 flex flex-col md:flex-row justify-between items-center py-10 px-20">
      <div className="flex flex-col items-center md:items-start">
        <Image
          src="/ryomi-dark.png"
          width={100}
          height={100}
          alt="Ryomi logo"
          className="w-56"
          draggable={false}
        />
        <p className="text-sm text-muted-foreground mt-5 text-nowrap">
          Fast AF transcoder and AI subtitle generator
        </p>
        <div className="w-full mt-8 flex gap-x-1.5 justify-center">
          <Link
            target="_blank"
            href="https://github.com/sarthakroy107/ryomi"
            className="hover:bg-white/5 p-2 rounded-[5px] group transition-all"
          >
            <GithubIcon
              size={20}
              className="text-muted-foreground group-hover:text-white/75"
            />
          </Link>
          <Link
            target="_blank"
            href="https://x.com/sarthakroy107"
            className="hover:bg-white/5 p-2 rounded-[5px] group transition-all"
          >
            <TwitterIcon
              size={20}
              className="text-muted-foreground group-hover:text-white/75"
            />
          </Link>
          <Link
            target="_blank"
            href="https://www.linkedin.com/in/sarthakroy107"
            className="hover:bg-white/5 p-2 rounded-[5px] group transition-all"
          >
            <LinkedinIcon
              size={20}
              className="text-muted-foreground group-hover:text-white/75"
            />
          </Link>
        </div>
      </div>
      <div className="mt-5">
        <div className="flex flex-col md:flex-row gap-y-8 gap-x-12 items-center transition md:mr-56 lg:mr-64">
          <div className="text-muted-foreground flex flex-col items-center md:items-start">
            <p className="font-semibold text-white/80 hover:text-white/80 mb-2">
              Links
            </p>
            <Link
              className="footer-link hover:text-white/80 text-sm my-0.5 font-medium"
              href="/register"
            >
              Register
            </Link>
            <Link
              className="footer-link hover:text-white/80 text-sm my-0.5 font-medium"
              href="/login"
            >
              Login
            </Link>
            <Link
              className="footer-link hover:text-white/80 text-sm my-0.5 font-medium"
              href="/plans"
            >
              Pricing
            </Link>
          </div>
          <div className="text-muted-foreground flex flex-col items-center md:items-start">
            <p className="font-semibold text-white/80 hover:text-white/80 mb-2">
              Legal
            </p>
            <Link
              className="footer-link hover:text-white/80 text-sm my-0.5 font-medium"
              href="/tnc"
            >
              Terms & conditions
            </Link>
            <Link
              className="footer-link hover:text-white/80 text-sm my-0.5 font-medium"
              href="/privacy"
            >
              Privacy policy
            </Link>
            <Link
              className="footer-link hover:text-white/80 text-sm my-0.5 font-medium"
              href="/blocked-regions"
            >
              Block regions
            </Link>
          </div>
        </div>
        <p className="mt-10 text-muted-foreground font-medium text-center md:text-start text-sm md:text-base">
          © 2025. A House of Aokura venture
        </p>
      </div>
    </footer>
  );
}
