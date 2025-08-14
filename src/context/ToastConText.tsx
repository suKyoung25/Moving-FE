"use client";

import React, {
   createContext,
   useContext,
   useState,
   useCallback,
   ReactNode,
} from "react";

interface Toast {
   id: number;
   text: string;
   success: boolean;
}

interface ToastContextType {
   toast: Toast | null;
   showSuccess: (text: string) => void;
   showError: (text: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
   const [toast, setToast] = useState<Toast | null>(null);

   const showSuccess = useCallback((text: string) => {
      setToast({
         id: Date.now(),
         text,
         success: true,
      });
   }, []);

   const showError = useCallback((text: string) => {
      setToast({
         id: Date.now(),
         text,
         success: false,
      });
   }, []);

   return (
      <ToastContext.Provider
         value={{
            toast,
            showSuccess,
            showError,
         }}
      >
         {children}
      </ToastContext.Provider>
   );
}

export function useToast() {
   const context = useContext(ToastContext);
   if (context === undefined) {
      throw new Error("useToast는 ToastProvider 내부에서 사용해야 합니다.");
   }
   return context;
}
