"use client";

import React from "react";
import ErrorText from "../auth/ErrorText";
import { FieldValue, InputFieldProps } from "@/lib/types";

//상세 설명 (textArea) input인 경우
function TextAreaInputField<T extends Record<string, FieldValue>>({
   name,
   text,
   placeholder,
   register,
   error,
   labelId,
}: InputFieldProps<T>) {
   const textAreaId = `${name}-textarea`;
   const errorId = `${name}-error`;

   return (
      <div className="flex flex-col gap-4">
         <label
            id={labelId}
            htmlFor={textAreaId}
            className="text-16-semibold lg:text-20-semibold"
         >
            {text}
            <span className="text-blue-300"> *</span>
         </label>

         <textarea
            id={textAreaId}
            aria-labelledby={labelId}
            aria-describedby={error ? errorId : undefined}
            aria-invalid={!!error}
            {...register?.(name)}
            className={`bg-bg-200 mt-4 h-13 w-full rounded-2xl pt-3.5 pl-3.5 placeholder:text-gray-300 md:h-40 lg:h-40 ${error ? "border border-red-500" : ""}`}
            placeholder={placeholder}
         />

         <ErrorText error={error?.message} position="left" />
      </div>
   );
}

export default TextAreaInputField;
