"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

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
