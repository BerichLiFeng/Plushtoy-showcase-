"use client";

import { LangProvider } from "@/lib/locales/context";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export function LangWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LangProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </LangProvider>
  );
}