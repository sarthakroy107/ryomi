import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AllProviders from "@/components/providers/main.provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Ryomi by Sarthak Roy",
  description:
    "A simeple wet powerful video codec and resolution converter with AI subtitle generation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AllProviders>{children}</AllProviders>
      </body>
    </html>
  );
}
