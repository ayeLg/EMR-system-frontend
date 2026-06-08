"use client";

import { Spin } from "antd";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useCurrentUser();

  if (isLoading) {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  // Invalid/expired session: axios 401 handler clears the cookie and sends user to /login.
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
