/**
 * 사용법:
 *
 * showSuccess("로그인 성공!")
 * showError("로그인 실패!")
 * hideToast: 알림 보이다가 사라지게 하고 싶을 때
 */

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
   showToast: (text: string, success?: boolean) => void;
   showSuccess: (text: string) => void;
   showError: (text: string) => void;
   hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
   const [toast, setToast] = useState<Toast | null>(null);

   const showToast = useCallback((text: string, success: boolean = true) => {
      setToast({
         id: Date.now(),
         text,
         success,
      });
   }, []);

   const showSuccess = useCallback(
      (text: string) => {
         showToast(text, true);
      },
      [showToast],
   );

   const showError = useCallback(
      (text: string) => {
         showToast(text, false);
      },
      [showToast],
   );

   const hideToast = useCallback(() => {
      setToast(null);
   }, []);

   return (
      <ToastContext.Provider
         value={{
            toast,
            showToast,
            showSuccess,
            showError,
            hideToast,
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
