"use client";

import React, { useEffect, useState } from "react";
import ErrorText from "./ErrorText";
import { AuthValidationResult } from "@/lib/types/auth.type";

interface Props {
   type?: "text" | "email";
   name: string;
   label: string;
   placeholder: string;
   validator?: (value: string) => AuthValidationResult;
   onValidChange?: (key: string, isValid: boolean) => void;
   onValueChange?: (key: string, value: string) => void;
   serverError?: string;
}

export default function AuthInput({
   type = "text",
   name,
   label,
   placeholder,
   validator,
   onValidChange,
   onValueChange,
   serverError,
}: Props) {
   const [value, setValue] = useState<string>("");
   const [clientError, setClientError] = useState("");

   // ✅ 값과 errorText 변경
   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);

      if (validator) {
         const result = validator(newValue);
         onValueChange?.(name, newValue);

         if (result.success) {
            onValidChange?.(name, true);
            setClientError("");
         } else {
            onValidChange?.(name, false);
            setClientError(result.message);
         }
      }
   };

   // ✅ 백엔드에서 받는 오류 메시지
   useEffect(() => {
      if (serverError) {
         setClientError("");
      }
   }, [serverError]);

   // 표시할 메시지 결정 (서버 우선)
   const displayError = serverError || clientError;

   return (
      <section className="flex w-full flex-col gap-2 lg:gap-4">
         <label htmlFor={name}>{label}</label>
         <input
            type={type}
            id={name}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={handleChange}
            className={`${displayError ? "border-secondary-red-200 focus:border-secondary-red-200" : "border-line-200 focus:border-primary-blue-300"} text-black-400 h-14 rounded-2xl border bg-white p-3.5 lg:h-16`}
         />

         {displayError && <ErrorText error={displayError} />}
      </section>
   );
}
