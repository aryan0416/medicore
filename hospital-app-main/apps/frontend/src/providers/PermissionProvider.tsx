"use client";

import { createContext, useContext } from "react";

const PermissionContext = createContext<string[]>([]);

export function PermissionProvider({
  children,
  permissions = [],
  role = "",
}: {
  children: React.ReactNode;
  permissions?: string[];
  role?: string;
}) {
  return (
    <PermissionContext.Provider value={permissions}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions() {
  return useContext(PermissionContext);
}
