"use client";

import React from "react";
import { FieldValue, InputFieldProps } from "@/lib/types/mover.types";
import ErrorText from "../auth/ErrorText";

//상세 설명 (textArea) input인 경우
function TextAreaInputField<T extends Record<string, FieldValue>>({
   name,
   text,
   placeholder,
   register,
   error,
}: InputFieldProps<T>) {
   return (
      <div className="flex flex-col gap-4">
         <div className="text-16-semibold lg:text-20-semibold">
            {text}
            <span className="text-blue-300"> *</span>
         </div>
         <textarea
            {...register?.(name)}
            className={`mg:h-13 bg-bg-200 h-13 w-full rounded-2xl pt-3.5 pl-3.5 placeholder:text-gray-300 lg:h-40 ${error ? "border border-red-500" : ""}`}
            placeholder={placeholder}
         />

         <ErrorText error={error?.message} position="left" />
      </div>
   );
}

export default TextAreaInputField;
