"use client";

import React, { useState } from "react";
import { InputFieldProps } from "@/lib/types/profile.types";
import { validateDetailDescription } from "@/lib/validations";

//상세 설명 (textArea) input인 경우
function TextAreaInputField({
   name,
   text,
   placeholder,
   defaultValue,
   onValidChange, // 주석: 시작하기 버튼의 활성화 관련
}: InputFieldProps) {
   const [value, setValue] = useState<string | string[]>(defaultValue ?? "");
   const [error, setError] = useState("");

   const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
   ) => {
      const newVal = e.target.value;
      setValue(newVal);

      const result = validateDetailDescription(newVal);

      if (result.success) {
         onValidChange?.(name, result.success);
         setError("");
      } else {
         onValidChange?.(name, result.success);
         setError(result.message);
      }
   };

   return (
      <div className="flex flex-col gap-4">
         <div className="text-16-semibold lg:text-20-semibold">
            {text}
            <span className="text-blue-300"> *</span>
         </div>
         <textarea
            name={name}
            value={value}
            onChange={handleChange}
            className={`mg:h-13 bg-bg-200 h-13 w-full rounded-2xl pt-3.5 pl-3.5 placeholder:text-gray-300 lg:h-40 ${error ? "border border-red-500" : ""}`}
            placeholder={placeholder}
         />
         {error && (
            <div className="mt-2 text-base leading-6.5 font-medium text-red-500">
               {error}
            </div>
         )}
      </div>
   );
}

export default TextAreaInputField;
