"use client";

import React from "react";
import { FieldValue, InputFieldProps } from "@/lib/types/profile.types";
import ErrorText from "../auth/ErrorText";

//일반적인 (별명, 경력, 한 줄 소개) input인 경우
function GeneralInputField<T extends Record<string, FieldValue>>({
   name,
   text,
   placeholder,
   register,
   error,
}: InputFieldProps<T>) {
   return (
      <div className="flex flex-col gap-4 leading-8">
         <div className="text-16-semibold lg:text-20-semibold">
            {text}
            <span className="text-blue-300"> *</span>
         </div>
         <input
            type="text"
            {...register?.(name)}
            className={`mg:h-13 bg-bg-200 h-13 w-full rounded-2xl pl-3.5 placeholder:text-gray-300 lg:h-16 ${error ? "border border-red-500" : ""}`}
            placeholder={placeholder}
         />

         {error && <ErrorText error={error.message} />}
      </div>
   );
}

export default GeneralInputField;
