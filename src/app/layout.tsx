"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "@/shared/globals.css";
import { LinkUI } from "@/components/ui/link";
// import { AuthContext } from "@/modules/auth/auth-context";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { routes } from "@/constants/routes";
import { AuthProvider, useAuth } from "@/modules/auth/auth-context";
import { getUserById } from "@/modules/auth/auth";
import { User } from "@prisma/client";

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
  // const { getMeState, loadMe } = useGetMeApi();
  // const {
  //   process: { error, loading },
  //   user,
  // } = getMeState;

  // React.useEffect(() => {
  //   loadMe();
  // }, [loadMe]);

  const render = () => {
    // if (loading) return <FullScreenLoader />;
    // if (error) return "Что-то пошло не по плану";

    return children;
  };

  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AuthProvider>
          <div className="flex flex-col h-screen">
            <Header />

            <div className="flex flex-1 overflow-hidden">
              <Sidebar />

              {/* Main Content */}
              <main className="flex-1 p-4 overflow-auto">{render()}</main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

const Header = () => {
  const { user, logout, setUser } = useAuth();

  return (
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

        {user && (
          <Button onClick={logout} className="justify-end">
            Выйти
          </Button>
        )}

        {!user && (
          <LinkUI href={routes.home}>
            <Button className="justify-end">Войти</Button>
          </LinkUI>
        )}
      </div>
    </header>
  );
};

const Sidebar = () => {
  return (
    <aside className="w-[220px] bg-gray-200 p-4 flex-shrink-0">
      <nav className="flex flex-col space-y-2">
        <LinkUI theme="dark" href={routes.boards}>
          Доски
        </LinkUI>
        <LinkUI theme="dark" href={routes.permissions}>
          Мои доступы
        </LinkUI>
        <LinkUI theme="dark" href="#">
          Link 3
        </LinkUI>
      </nav>
    </aside>
  );
};
