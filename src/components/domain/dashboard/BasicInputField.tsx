"use client";

import { BasicInfoInputProps } from "@/lib/types";
import React from "react";
import { FieldValues } from "react-hook-form";
import ErrorText from "../auth/ErrorText";

//기본정보 수정페이지 기본input 컴포넌트화
function BasicInputField<T extends FieldValues>({
   name,
   text,
   placeholder,
   register,
   error,
}: BasicInfoInputProps<T>) {
   return (
      <div className="flex flex-col gap-4 leading-8">
         <div className="text-16-semibold lg:text-20-semibold">{text}</div>
         <input
            {...register(name)}
            name={name}
            type="text"
            placeholder={placeholder}
            className={`mg:h-13 bg-bg-200 h-13 w-full rounded-2xl pl-3.5 placeholder:text-gray-300 lg:h-16 ${error ? "border border-red-500" : ""}`}
         />

         {error && <ErrorText error={error} />}
      </div>
   );
}

export default BasicInputField;
