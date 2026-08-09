"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type SuperAdminGPContextType = {
  granPremioId: number | null;
  setGranPremioId: (id: number | null) => void;
};

const SuperAdminGPContext =
  createContext<SuperAdminGPContextType | undefined>(
    undefined
  );

export function SuperAdminGPProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [granPremioId, setGranPremioId] =
    useState<number | null>(null);

  return (
    <SuperAdminGPContext.Provider
      value={{
        granPremioId,
        setGranPremioId,
      }}
    >
      {children}
    </SuperAdminGPContext.Provider>
  );
}

export function useSuperAdminGP() {
  const context =
    useContext(SuperAdminGPContext);

  if (!context) {
    throw new Error(
      "useSuperAdminGP debe utilizarse dentro de SuperAdminGPProvider"
    );
  }

  return context;
}