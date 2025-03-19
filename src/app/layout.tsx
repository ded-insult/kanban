import { Geist, Geist_Mono } from "next/font/google";
import "@/shared/globals.css";
import { LinkUI } from "@/components/ui/link";
// import { AuthContext } from "@/modules/auth/auth-context";
import React, { useState } from "react";
import { routes } from "@/constants/routes";
import { getCurrentUser } from "@/lib/auth2";
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
  const user = await getCurrentUser();
  const render = () => {
    // if (loading) return <FullScreenLoader />;
    // if (error) return "Что-то пошло не по плану";

    return children;
  };

  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        {/* <AuthProvider> */}
        <div className="flex flex-col h-screen">
          <Header />

          <div className="flex flex-1 overflow-hidden">
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 p-4 overflow-auto">{render()}</main>
          </div>
        </div>
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}

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
