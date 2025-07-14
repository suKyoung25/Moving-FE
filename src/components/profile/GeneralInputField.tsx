"use client";

import React, { useState } from "react";
import { InputFieldProps } from "@/lib/types/profile.types";

//일반적인 (별명, 경력, 한 줄 소개) input인 경우
function GeneralInputField({
   name,
   text,
   placeholder,
   validator,
   onValidChange, // 주석: 시작하기 버튼의 활성화 관련
}: InputFieldProps) {
   const [value, setValue] = useState<string | string[]>("");
   const [error, setError] = useState("");

   const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
   ) => {
      const newVal = e.target.value;
      setValue(newVal);

      if (validator) {
         const result = validator(newVal);

         if (result.success) {
            onValidChange?.(name, result.success);
            setError("");
         } else {
            onValidChange?.(name, result.success);
            setError(result.message);
         }
      }
   };

   return (
      <div className="flex flex-col gap-4 leading-8">
         <div className="text-16-semibold lg:text-20-semibold">
            {text}
            <span className="text-blue-300"> *</span>
         </div>
         <input
            name={name}
            value={value}
            onChange={handleChange}
            type="text"
            className={`mg:h-13 bg-bg-200 h-13 w-full rounded-2xl pl-3.5 placeholder:text-gray-300 lg:h-16 ${error ? "border border-red-500" : ""}`}
            placeholder={placeholder}
         />

         {error && (
            <div className="mt-2 self-end text-base leading-6.5 font-medium text-red-500">
               {error}
            </div>
         )}
      </div>
   );
}

export default GeneralInputField;
