import type { Metadata } from "next";
import "./globals.css";
import { LangWrapper } from "./lang-wrapper";

export const metadata: Metadata = {
  title: {
    default: "Dream Doll | Luxury Doll Manufacturer & Brand",
    template: "%s | Dream Doll",
  },
  description:
    "Dream Doll is a high-end doll manufacturing factory specializing in OEM/ODM doll processing, with our own luxury doll brand. Dreamy ballet, classic plush, and newborn doll collections.",
  keywords: [
    "doll factory", "doll manufacturing", "OEM doll", "plush toy manufacturer",
    "luxury doll", "dreamy ballet doll", "newborn doll", "custom doll",
    "玩偶工厂", "玩偶加工", "高奢玩偶",
  ],
  openGraph: {
    title: "Dream Doll | Luxury Doll Manufacturer & Brand",
    description: "Professional doll factory for OEM/ODM processing with our own luxury dreamy doll brand.",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <LangWrapper>{children}</LangWrapper>
      </body>
    </html>
  );
}