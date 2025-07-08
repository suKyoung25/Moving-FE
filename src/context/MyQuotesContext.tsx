"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type Tab = "pending" | "received";

interface MyQuotesContext {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const MyQuotesContext = createContext<MyQuotesContext | undefined>(undefined);

export function MyQuotesProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<Tab>("pending");

  return (
    <MyQuotesContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </MyQuotesContext.Provider>
  );
}

export const useMyQuotes = () => {
  const context = useContext(MyQuotesContext);
  if (context === undefined) {
    throw new Error("useMyQuotes must be used within a MyQuotesProvider");
  }
  return context;
};
