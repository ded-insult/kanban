import { Geist, Geist_Mono } from "next/font/google";
import "@/shared/globals.css";
import { BoardIcon, LinkUI, PermissionIcon } from "@/components/ui/link";
import React from "react";
import { routes } from "@/shared/constants/routes";
import { ToastContainer } from "react-toastify";
import { Header } from "./header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <div className="flex flex-col h-screen">
          <Header />

          <div className="flex flex-1 overflow-hidden">
            <Sidebar />

            <main className="flex-1 p-4 overflow-auto">{children}</main>
          </div>
        </div>
        <ToastContainer limit={2} />
      </body>
    </html>
  );
}

const Sidebar = () => {
  return (
    <aside className="w-[260px] bg-gray-50 dark:bg-gray-800 p-6 flex-shrink-0 border-r border-gray-200 dark:border-gray-700">
      <nav className="flex flex-col space-y-3">
        <LinkUI theme="dark" href={routes.boards.initial} className="group">
          <span className="flex items-center gap-3">
            <BoardIcon className="w-5 h-5 text-gray-500 group-hover:text-indigo-600 transition-colors" />
            Доски
          </span>
        </LinkUI>
        <LinkUI theme="dark" href={routes.permissions} className="group">
          <span className="flex items-center gap-3">
            <PermissionIcon className="w-5 h-5 text-gray-500 group-hover:text-indigo-600 transition-colors" />
            Мои доступы
          </span>
        </LinkUI>
      </nav>
    </aside>
  );
};
