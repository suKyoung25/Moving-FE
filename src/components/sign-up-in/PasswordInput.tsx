"use client";

import React, { useState } from "react";
import ErrorText from "./ErrorText";
import Image from "next/image";
import openedEye from "@/assets/images/visibilityIcon.svg";
import closedEye from "@/assets/images/visibilityOffIcon.svg";
import { AuthValidationResult } from "@/lib/types/auth.type";

interface Props {
   type: "text" | "password";
   name: string;
   label: string;
   placeholder: string;
   validator?: (value: string) => AuthValidationResult;
   onValidChange?: (key: string, isValid: boolean) => void;
   onValueChange?: (key: string, value: string) => void;
   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
   errorText?: string | Record<string, string>;
}

export default function PasswordInput({
   name,
   label,
   validator,
   placeholder,
   onValidChange,
   onValueChange,
   onChange,
   errorText,
}: Props) {
   const [isVisible, setIsVisible] = useState(false);
   const [value, setValue] = useState<string>("");
   const [error, setError] = useState("");

   // type="password" <-> "text"
   const toggleEyeIcon = () => setIsVisible((prev) => !prev);

   // ✅ 값과 errorText 변경
   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);

      if (onChange) onChange(e);

      if (validator) {
         const result = validator(newValue);
         onValueChange?.(name, newValue);

         if (result.success) {
            onValidChange?.(name, true);
            setError("");
         } else {
            onValidChange?.(name, false);
            setError(result.message);
         }
      }
   };

   // errorText가 들어오면 내부 error 대신 표시 (= 백엔드 로그인 정보 없을 때)
   let displayError = error;

   if (errorText && typeof errorText === "object" && name in errorText) {
      displayError = (errorText as Record<string, string>)[name];
   }

   return (
      <section className="flex w-full flex-col gap-2 lg:gap-4">
         <label htmlFor={name}>{label}</label>

         <div className="relative w-full">
            {/* 입력창 */}
            <input
               type={isVisible ? "text" : "password"}
               name={name}
               value={value}
               placeholder={placeholder}
               onChange={handleChange}
               className={`${displayError ? "border-secondary-red-200 focus:border-secondary-red-200" : "border-line-200 focus:border-primary-blue-300"} text-black-400 h-14 w-full rounded-2xl border bg-white p-3.5 lg:h-16`}
            />
            {/* 눈 아이콘 */}
            <button
               type="button"
               onClick={toggleEyeIcon}
               className="absolute top-1/2 right-3 -translate-y-1/2"
            >
               <Image
                  src={isVisible ? openedEye : closedEye}
                  alt="비밀번호 토글 아이콘"
                  width={24}
                  height={24}
               />
            </button>
         </div>

         {displayError && <ErrorText error={displayError} />}
      </section>
   );
}
