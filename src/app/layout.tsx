import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layouts/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistem Pakar dan RAG-LLM Diagnosis TBC Paru",
  description: "Aplikasi diagnosis dini penyakit tuberkulosis paru",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col ">
        <Navbar />
        <main className="flex-1 bg-linear-to-br from-[#F8FAFB] via-[#EEF5F6] to-[#E3F1F1]">{children}</main>
      </body>
    </html>
  );
}
