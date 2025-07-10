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
}

export default function PasswordInput({
   name,
   label,
   validator,
   placeholder,
   onValidChange,
   onValueChange,
   onChange,
}: Props) {
   const [isVisible, setIsVisible] = useState(false);
   const [value, setValue] = useState<string>("");
   const [error, setError] = useState("");

   const toggleEyeIcon = () => setIsVisible((prev) => !prev);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);

      if (onChange) {
         onChange(e);
      }

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
               className={`${error ? "border-secondary-red-200 focus:border-secondary-red-200" : "border-line-200 focus:border-primary-blue-300"} text-black-400 h-14 w-full rounded-2xl border bg-white p-3.5 lg:h-16`}
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

         {error && <ErrorText error={error} />}
      </section>
   );
}
