// "use client";

// import { createContext, useContext, useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { routes } from "@/constants/routes";

// type newUser = { name: string; password: string; roleId: string } | null;

// const AuthContext = createContext<{
//   user: newUser;
//   setUser: (user: newUser) => void;
//   logout: () => void;
// }>({
//   user: null,
//   setUser: () => {},
//   logout: () => {},
// });

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUserState] = useState<newUser>(null);
//   const router = useRouter();

//   // Загрузка пользователя из localStorage при инициализации
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUserState(JSON.parse(storedUser));
//     }
//   }, []);

//   // Обновление localStorage при изменении пользователя
//   const setUser = (newUser: newUser) => {
//     setUserState(newUser);
//     if (newUser) {
//       localStorage.setItem("user", JSON.stringify(newUser));
//     } else {
//       localStorage.removeItem("user");
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     router.push(routes.home);
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const { user } = useContext(AuthContext);
//   const router = useRouter();

//   useEffect(() => {
//     if (!user) {
//       router.push("/");
//     }
//   }, [user, router]);

//   if (!user) return null;
//   return <>{children}</>;
// }

// export const useAuth = () => useContext(AuthContext);

"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/constants/routes";
import { loginUser } from "./auth";
import { getCurrentUser } from "@/lib/auth2";

export function ProtectedRoute({
  user,
  children,
}: {
  user: { roleId: string } | null;
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  if (!user) return null;
  return <>{children}</>;
}
