"use client";

import { createContext, ReactNode, useState } from "react";

type Tab = "pending" | "received";

interface MyQuotesContext {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const MyQuotesContext = createContext<MyQuotesContext | undefined>(
  undefined
);

// 헤더에서 컴포넌트로 변경을 위한 provider
export function MyQuotesProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<Tab>("pending");

  return (
    <MyQuotesContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </MyQuotesContext.Provider>
  );
}

