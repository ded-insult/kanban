"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "@/shared/globals.css";
import { LinkUI } from "@/components/ui/link";
import { AuthContext } from "@/context/auth-context";
import React from "react";
import { useGetMeApi } from "@/lib/get-user";
import { FullScreenLoader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { routes } from "@/constants/routes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { getMeState, loadMe } = useGetMeApi();
  const {
    process: { error, loading },
    user,
  } = getMeState;

  React.useEffect(() => {
    loadMe();
  }, [loadMe]);

  const render = () => {
    if (loading) return <FullScreenLoader />;
    if (error) return "Что-то пошло не по плану";

    return children;
  };

  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <div className="flex flex-col h-screen">
          {/* Header */}
          <header className="bg-blue-500 text-white p-4 h-[60px] flex items-center justify-between w-full">
            <h1 className="text-2xl font-bold">
              <LinkUI
                className="text-white-700 hover:text-gray-400"
                href={routes.home}
              >
                Название проекта
              </LinkUI>
            </h1>
            <div>
              {user?.name}
              <Button className="justify-end">Выйти</Button>
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-[220px] bg-gray-200 p-4 flex-shrink-0">
              <nav className="flex flex-col space-y-2">
                <LinkUI theme="dark" href={routes.boards}>
                  Доски
                </LinkUI>
                <LinkUI theme="dark" href="#">
                  Link 2
                </LinkUI>
                <LinkUI theme="dark" href="#">
                  Link 3
                </LinkUI>
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 overflow-auto">
              <AuthContext.Provider value={user}>
                {render()}
              </AuthContext.Provider>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
