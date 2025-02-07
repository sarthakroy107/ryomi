import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="sticky top-0 py-4 px-7 border-b border-white/5 flex items-center justify-between bg-[#0a0a0a] bg-opacity-70 backdrop-blur-md z-10">
      <Link href="/" className="flex items-center gap-x-2">
        <Image
          src="/ryomi-dark.png"
          width={100}
          height={30}
          alt="Logo"
          draggable={false}
        />
      </Link>
      <div className="flex gap-x-5">
        <Link
          href="/login"
          className="text-muted-foreground hover:text-white/85 transition footer-link"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="text-muted-foreground hover:text-white/85 transition footer-link"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
