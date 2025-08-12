"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface SupportHubContextValue {
   isOpen: boolean;
   openHub: () => void;
   closeHub: () => void;
   toggleHub: () => void;
}

const SupportHubContext = createContext<SupportHubContextValue | null>(null);

export function SupportHubProvider({ children }: { children: ReactNode }) {
   const [isOpen, setIsOpen] = useState(false);

   const openHub = () => setIsOpen(true);
   const closeHub = () => setIsOpen(false);
   const toggleHub = () => setIsOpen((prev) => !prev);

   return (
      <SupportHubContext.Provider
         value={{ isOpen, openHub, closeHub, toggleHub }}
      >
         {children}
      </SupportHubContext.Provider>
   );
}

export function useSupportHub() {
   const ctx = useContext(SupportHubContext);
   if (!ctx) {
      throw new Error("useSupportHub must be used within SupportHubProvider");
   }
   return ctx;
}
