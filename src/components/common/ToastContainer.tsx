// 원래 있던 ToastPopup을 한 번 감싼 컴포넌트입니다.

"use client";

import React from "react";
import ToastPopup from "./ToastPopup";
import { useToast } from "@/context/ToastConText";

export default function ToastContainer() {
   const { toast } = useToast();

   return (
      <>
         {toast && (
            <ToastPopup
               aria-label="토스트 알림"
               aria-live="polite"
               aria-atomic="true"
               key={toast.id}
               text={toast.text}
               success={toast.success}
            />
         )}
      </>
   );
}
